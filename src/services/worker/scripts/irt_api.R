#!/usr/bin/env Rscript
# Plumber API for IRT scoring
library(jsonlite)
library(plumber)
library(mirt)

## Try to locate project-level IRT script (prefer irt_run.R then irt_scoring.R)
find_project_script <- function(){
  # attempt to determine current script dir
  script_dir <- NULL
  args <- commandArgs(trailingOnly = FALSE)
  file_arg <- args[grep('--file=', args)]
  if (length(file_arg) > 0) {
    script_dir <- dirname(sub('--file=', '', file_arg[1]))
  } else {
    of <- try(sys.frame(1)$ofile, silent = TRUE)
    if (!inherits(of, 'try-error') && !is.null(of)) script_dir <- dirname(of)
  }

  candidates <- c()
  if (!is.null(script_dir)) {
    candidates <- c(candidates,
      file.path(script_dir, 'irt_run.R'),
      file.path(script_dir, 'irt_scoring.R')
    )
  }

  # common workspace-relative locations
  candidates <- c(candidates,
    file.path(getwd(), 'src', 'services', 'worker', 'scripts', 'irt_run.R'),
    file.path(getwd(), 'src', 'services', 'worker', 'scripts', 'irt_scoring.R'),
    file.path(getwd(), 'scripts', 'irt_run.R'),
    file.path(getwd(), 'scripts', 'irt_scoring.R'),
    file.path(getwd(), 'irt_run.R'),
    file.path(getwd(), 'irt_scoring.R')
  )

  # remove duplicates, return first existing
  candidates <- unique(candidates)
  for (p in candidates){
    if (file.exists(p)) return(p)
  }
  return(NULL)
}

proj_script <- find_project_script()
if (!is.null(proj_script)){
  message('Sourcing project IRT script from: ', proj_script)
  tryCatch({ source(proj_script) }, error = function(e) message('Failed to source project IRT script: ', e$message))
} else {
  message('No external project IRT script found; using internal scoring logic')
}

#* @apiTitle IRT Scoring API

#* Calculate IRT scores from JSON input
#* @post /calculate-irt
function(req, res){
  # req$postBody is raw JSON
  input <- tryCatch({
    fromJSON(req$postBody)
  }, error = function(e){
    res$status <- 400
    return(list(error = 'invalid_json', message = e$message))
  })

  responses <- input$responses
  if (is.null(responses)){
    res$status <- 400
    return(list(error = 'missing_responses'))
  }

  # If the project script exposes `process_responses`, delegate to it (expects a list with responses and optional names)
  if (exists('process_responses') && is.function(process_responses)){
    tryCatch({
      out <- process_responses(input)
      res$status <- 200
      return(out)
    }, error = function(e){
      res$status <- 500
      return(list(error = 'processing_error', message = e$message))
    })
  }

  # Convert incoming responses into simple vectors
  # Expect responses as list of objects with fields: questionId, selectedAnswer, correctAnswer, difficulty, discrimination, guessing
  tryCatch({
    df <- data.frame(
  #* Health check
  #* @get /healthz
  function(){
    list(status = 'ok')
  }

  #* Calculate IRT scores from JSON input
  #* @post /calculate-irt
      questionId = sapply(responses, function(x) x$questionId),
      selected = sapply(responses, function(x) as.integer(x$selectedAnswer)),
      correct = sapply(responses, function(x) as.integer(x$correctAnswer)),
      difficulty = sapply(responses, function(x) as.numeric(x$difficulty)),
      discrimination = sapply(responses, function(x) as.numeric(x$discrimination)),
      guessing = sapply(responses, function(x) ifelse(is.null(x$guessing), 0.25, as.numeric(x$guessing)))
    )
  }, error = function(e){
    res$status <- 400
    return(list(error = 'invalid_responses', message = e$message))
  })

  # Build binary response vector
  binary <- as.integer(df$selected == df$correct)

  # Try to run a simple IRT estimation using mirt (3PL approximation)
  theta <- NA
  se <- NA
  item_probs <- rep(NA, nrow(df))

  tryCatch({
    # Prepare a one-row response matrix for mirt
    resp_mat <- data.frame(t(binary))
    colnames(resp_mat) <- paste0('V', seq_len(ncol(resp_mat)))

    # Create item specification with 3PL parameters
    # mirt can fit models from data; to speed up, we will use a pattern by constructing items via pars
    mod <- mirt(resp_mat, 1, itemtype = '3PL', verbose = FALSE)
    fs <- fscores(mod, method = 'MAP')
    theta <- as.numeric(fs[1,1])
    se <- as.numeric(fs[1,2])

    # compute 3PL probability for each item
    a <- df$discrimination
    b <- df$difficulty
    c <- df$guessing
    prob <- c + (1 - c) / (1 + exp(-a * (theta - b)))
    item_probs <- as.numeric(prob)
  }, error = function(e){
    # fallback: simple weighted score
    theta <<- sum(binary * df$discrimination) / sum(df$discrimination)
    se <<- NA
    item_probs <<- rep(NA, nrow(df))
  })

  raw_score <- sum(binary)
  total <- length(binary)
  percentage <- (raw_score / total) * 100

  items_out <- lapply(seq_len(nrow(df)), function(i){
    list(
      questionId = df$questionId[i],
      probability = ifelse(is.na(item_probs[i]), NA, round(item_probs[i],4)),
      correct = as.logical(df$selected[i] == df$correct[i])
    )
  })

  out <- list(
    ability = ifelse(is.na(theta), NULL, round(theta,4)),
    standardError = ifelse(is.na(se), NULL, round(se,4)),
    score = round(percentage,2),
    itemScores = items_out
  )

  res$status <- 200
  return(out)
}

# Run plumber when executed
safe_is_cli <- function(){ tryCatch({ identical(sys.call(1), quote(-1)) }, error = function(e) FALSE) }
if (safe_is_cli()){
  pr <- plumber::plumb(sys.frame(1)$ofile)
  pr$run(host='0.0.0.0', port = as.integer(Sys.getenv('PORT', '8000')))
}
