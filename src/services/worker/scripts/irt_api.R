#!/usr/bin/env Rscript
# Plumber API for IRT scoring
suppressWarnings(suppressPackageStartupMessages({
  library(jsonlite)
  library(plumber)
}))

## Try to locate project-level IRT script (prefer irt_run.R then irt_scoring.R)
find_project_script <- function(){
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

  candidates <- c(candidates,
    file.path(getwd(), 'src', 'services', 'worker', 'scripts', 'irt_run.R'),
    file.path(getwd(), 'src', 'services', 'worker', 'scripts', 'irt_scoring.R'),
    file.path(getwd(), 'scripts', 'irt_run.R'),
    file.path(getwd(), 'scripts', 'irt_scoring.R'),
    file.path(getwd(), 'services', 'worker', 'scripts', 'irt_run.R'), # Docker specific path
    file.path(getwd(), 'irt_run.R'),
    file.path(getwd(), 'irt_scoring.R')
  )

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

#* Health check
#* @get /healthz
function(){ list(status = 'ok') }

#* Calculate IRT scores from JSON input
#* @post /calculate-irt
function(req, res){
  # Authorization: if IRT_API_KEY is set, require Bearer token
  required_key <- Sys.getenv('IRT_API_KEY', '')
  auth_header <- NULL
  if (!is.null(req$HTTP_AUTHORIZATION)) auth_header <- req$HTTP_AUTHORIZATION
  if (is.null(auth_header) && !is.null(req$headers) && !is.null(req$headers$authorization)) auth_header <- req$headers$authorization
  if (nchar(required_key) > 0){
    if (is.null(auth_header) || !grepl(required_key, auth_header, fixed = TRUE)){
      res$status <- 401
      return(list(error = 'unauthorized'))
    }
  }

  input <- tryCatch({ fromJSON(req$postBody) }, error = function(e){
    res$status <- 400
    return(list(error = 'invalid_json', message = e$message))
  })

  if (is.null(input$responses)){
    res$status <- 400
    return(list(error = 'missing_responses'))
  }

  # If the project script exposes `process_responses`, delegate to it
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

  # No project scoring implementation found
  res$status <- 501
  return(list(error = 'no_scoring_impl', message = 'No project scoring implementation found. Provide irt_run.R exposing process_responses().'))
}
