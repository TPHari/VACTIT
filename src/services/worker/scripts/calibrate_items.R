
suppressWarnings(suppressPackageStartupMessages({
  library(jsonlite)
  library(dplyr)
  library(tibble)
  library(purrr)
  library(readr)
  library(stringr)
  library(mirt)
}))

# Utility to calibrate a section
calibrate_section <- function(df, q_from, q_to, section_code, section_label) {
    sel <- paste0('Q', q_from:q_to)
    data_items <- df[, sel, drop = FALSE]

    # Remove non-varying items (essential for mirt)
    is_nonvary <- function(x) { ux <- unique(na.omit(x)); length(ux) == 1 }
    nonvary <- sel[purrr::map_lgl(sel, ~ is_nonvary(data_items[[.x]]))]
    use_items <- setdiff(sel, nonvary)
    
    if (length(use_items) < 3) {
        warning(sprintf('[%s] Not enough valid items for calibration. Skipping.', section_label))
        return(NULL)
    }
    
    data_use <- data_items[, use_items, drop = FALSE]

    cat(sprintf("Calibrating %s (%d items)...\n", section_label, length(use_items)))
    
    set.seed(123)
    # Using 2PL model
    fit <- tryCatch({ 
        mirt::mirt(data_use, 1, itemtype = '2PL', verbose = FALSE) 
    }, error = function(e) {
        warning(paste0('Fit error in ', section_label, ': ', e$message))
        return(NULL)
    })

    if (is.null(fit)) return(NULL)

    # Extract coefficients
    co <- mirt::coef(fit, IRTpars = TRUE, simplify = TRUE)$items
    item_params <- tibble::tibble(
        Item = rownames(co), 
        a = as.numeric(co[, 'a']), 
        b = as.numeric(co[, 'b'])
    )
    
    # Calculate proportion correct for reference
    prop_correct <- colMeans(data_use, na.rm = TRUE)
    item_params <- item_params %>% 
        dplyr::left_join(
            tibble::tibble(Item = names(prop_correct), Prop_Correct = as.numeric(prop_correct)), 
            by = 'Item'
        )

    return(list(params = item_params, section = section_code))
}


main <- function() {
    args <- commandArgs(trailingOnly = TRUE)
    if (length(args) < 1) {
        stop("Usage: Rscript calibrate_items.R <input_json_file> [output_json_file]")
    }
    
    input_file <- args[1]
    output_file <- if (length(args) >= 2) args[2] else "item_parameters.json"

    if (!file.exists(input_file)) stop("Input file not found.")

    cat("Reading input data...\n")
    input_text <- readLines(input_file, warn = FALSE)
    data <- fromJSON(paste(input_text, collapse = "\n"))
    
    if (is.null(data$responses)) stop("Input JSON must have 'responses' field.")

    # Process Input matrix similar to irt_run.R
    resp_mat <- as.data.frame(data$responses)
    resp_mat[] <- lapply(resp_mat, function(x) as.numeric(x))
    
    nr <- nrow(resp_mat)
    nc <- ncol(resp_mat)
    if (nc < 120 && nr >= 120) {
        resp_mat <- as.data.frame(t(resp_mat))
        resp_mat[] <- lapply(resp_mat, function(x) as.numeric(x))
        nr <- nrow(resp_mat)
        nc <- ncol(resp_mat)
    }
    
    if (nc < 120) stop(sprintf('Need at least 120 item columns; got %d', nc))
    if (nc > 120) resp_mat <- resp_mat[, 1:120]
    
    colnames(resp_mat) <- paste0('Q', seq_len(ncol(resp_mat)))
    df <- tibble::as_tibble(resp_mat)

    # Calibrate all sections
    params_vi  <- calibrate_section(df, 1, 30, 'vi', 'Tiếng Việt')
    params_en  <- calibrate_section(df, 31, 60, 'en', 'Tiếng Anh')
    params_mth <- calibrate_section(df, 61, 90, 'math', 'Toán học')
    params_sci <- calibrate_section(df, 91, 120, 'sci', 'Tư duy khoa học')

    all_params <- list(
        vi = params_vi$params,
        en = params_en$params,
        math = params_mth$params,
        sci = params_sci$params
    )
    
    # Save to JSON
    json_out <- toJSON(all_params, dataframe = "rows", auto_unbox = TRUE, pretty = TRUE)
    writeLines(json_out, output_file)
    cat(sprintf("Calibration complete. Parameters saved to %s\n", output_file))
}

if (!interactive()) {
    main()
}
