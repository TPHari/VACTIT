#!/usr/bin/env Rscript
# Simple R script to run a 2PL IRT model for 4 sections and return 0-300 scaled scores per section
# Expects JSON on stdin with shape: { "responses": [ [q1,q2,...,q120], ... ], optional "names": ["A","B",...] }

suppressWarnings(suppressPackageStartupMessages({
  library(jsonlite)
  library(dplyr)
  library(tibble)
  library(purrr)
  library(readr)
  library(stringr)
  # mirt loaded below
}))

# wrap whole processing so we always emit valid JSON and exit 0 to avoid non-zero exit codes
main <- function() {
  input_text <- tryCatch({
    paste(readLines(file("stdin"), warn = FALSE), collapse = "\n")
  }, error = function(e) "")

  if (nchar(input_text) == 0) {
    cat(toJSON(list(error = "no input"), auto_unbox=TRUE))
    return(invisible(NULL))
  }

  data <- fromJSON(input_text)
  if (is.null(data$responses)) {
    cat(toJSON(list(error = "missing responses field"), auto_unbox=TRUE))
    return(invisible(NULL))
  }

  resp_mat <- as.data.frame(data$responses)
# coerce to numeric (0/1)
resp_mat[] <- lapply(resp_mat, function(x) as.numeric(x))

# ensure 120 columns (Q1..Q120)
if (ncol(resp_mat) < 120) {
  write(toJSON(list(error = sprintf("need at least 120 item columns; got %d", ncol(resp_mat))), auto_unbox=TRUE), stdout())
  quit(status = 1)
}
if (ncol(resp_mat) > 120) {
  resp_mat <- resp_mat[, 1:120]
}

# student names
if (!is.null(data$names) && length(data$names) == nrow(resp_mat)) {
  names_vec <- as.character(data$names)
} else {
  names_vec <- paste0("Student", seq_len(nrow(resp_mat)))
}

# build df with name column and Q1..Q120
colnames(resp_mat) <- paste0("Q", seq_len(ncol(resp_mat)))
df <- tibble::as_tibble(resp_mat)
df <- df %>% tibble::add_column(name = names_vec, .before = 1)

suppressWarnings(suppressPackageStartupMessages({
  if (!requireNamespace("mirt", quietly = TRUE)) {
    write(toJSON(list(error = "R package 'mirt' is required. Install via install.packages('mirt')"), auto_unbox=TRUE), stdout())
    quit(status = 1)
  }
  library(mirt)
}))

# helper to fit a section and return student scores and item params
fit_section <- function(df, q_from, q_to, section_code, section_label) {
  sel <- paste0('Q', q_from:q_to)
  data_items <- df[, sel, drop = FALSE]

  is_nonvary <- function(x) { ux <- unique(na.omit(x)); length(ux) == 1 }
  nonvary <- sel[purrr::map_lgl(sel, ~ is_nonvary(data_items[[.x]]))]
  use_items <- setdiff(sel, nonvary)
  if (length(use_items) < 3) stop(sprintf('[%s] not enough valid items after removing non-varying', section_label))
  data_use <- data_items[, use_items, drop = FALSE]

  set.seed(123)
  fit <- tryCatch({ mirt::mirt(data_use, 1, itemtype = '2PL', verbose = FALSE) }, error = function(e) stop(paste0('fit error: ', e$message)))

  co <- mirt::coef(fit, IRTpars = TRUE, simplify = TRUE)$items
  item_params <- tibble::tibble(Item = rownames(co), a = as.numeric(co[, 'a']), b = as.numeric(co[, 'b']))
  prop_correct <- colMeans(data_use, na.rm = TRUE)
  item_params <- item_params %>% dplyr::left_join(tibble::tibble(Item = names(prop_correct), Prop_Correct = as.numeric(prop_correct)), by = 'Item')

  fs <- mirt::fscores(fit, method = 'EAP', full.scores.SE = TRUE)
  theta <- as.numeric(fs[,1]); se <- as.numeric(fs[,2])
  raw_score <- rowSums(data_use, na.rm = TRUE)

  th_min <- min(theta, na.rm = TRUE); th_max <- max(theta, na.rm = TRUE)
  score_0_300 <- if (is.finite(th_min) && is.finite(th_max) && th_max > th_min) 300 * (theta - th_min) / (th_max - th_min) else rep(NA_real_, length(theta))

  student_scores <- tibble::tibble(name = df$name,
                                   !!paste0('theta_', section_code) := theta,
                                   !!paste0('se_', section_code) := se,
                                   !!paste0('raw_', section_code) := raw_score,
                                   !!paste0('score0_300_', section_code) := score_0_300)

  # write CSVs
  readr::write_csv(student_scores, paste0('student_scores_2pl_', section_code, '.csv'))
  readr::write_csv(item_params, paste0('item_params_2pl_', section_code, '.csv'))

  list(scores = student_scores, items = item_params, fit = fit, removed = nonvary, used = use_items)
}

# run sections
res_vi  <- fit_section(df, 1, 30, 'vi', 'Tiếng Việt')
res_en  <- fit_section(df, 31, 60, 'en', 'Tiếng Anh')
res_mth <- fit_section(df, 61, 90, 'math', 'Toán học')
res_sci <- fit_section(df, 91, 120, 'sci', 'Tư duy khoa học')

# merge student scores
all_scores <- list(res_vi$scores, res_en$scores, res_mth$scores, res_sci$scores) %>% purrr::reduce(~ dplyr::full_join(.x, .y, by = 'name'))
readr::write_csv(all_scores, 'student_scores_2pl_ALL.csv')

out <- list(students = all_scores, items = list(vi = res_vi$items, en = res_en$items, math = res_mth$items, sci = res_sci$items))
cat(toJSON(out, dataframe = 'rows', auto_unbox = TRUE))

}

# Run main and ensure we always exit 0 (emit JSON)
tryCatch({
  main()
}, error = function(e) {
  cat(toJSON(list(error = paste0('R runtime error: ', e$message)), auto_unbox=TRUE))
})

quit(status = 0)
