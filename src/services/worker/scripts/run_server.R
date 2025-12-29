#!/usr/bin/env Rscript

library(plumber)

# Get the directory of this script
args <- commandArgs(trailingOnly = FALSE)
file_arg <- args[grep("--file=", args)]
if (length(file_arg) > 0) {
  script_dir <- dirname(sub("--file=", "", file_arg[1]))
} else {
  script_dir <- getwd()
}

# Path to the API definition
api_file <- file.path(script_dir, "irt_api.R")

if (!file.exists(api_file)) {
    # Fallback for when running from root or different context
    possible_paths <- c(
        file.path(getwd(), "src", "services", "worker", "scripts", "irt_api.R"),
        file.path(getwd(), "scripts", "irt_api.R")
    )
    for (p in possible_paths) {
        if (file.exists(p)) {
            api_file <- p
            break
        }
    }
}

if (!file.exists(api_file)) {
  stop("Could not find irt_api.R")
}

message("Starting Plumber server with API file: ", api_file)

pr <- plumber::plumb(api_file)

port <- as.integer(Sys.getenv("PORT", "8000"))
host <- "0.0.0.0"

message(sprintf("Running on %s:%d", host, port))

pr$run(host = host, port = port)
