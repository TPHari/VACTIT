FROM rocker/r-ver:4.2.2

ENV DEBIAN_FRONTEND=noninteractive

# Install build tools and system deps required by some R packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gfortran wget ca-certificates pkg-config zlib1g-dev libsodium-dev \
    libcurl4-openssl-dev libssl-dev libxml2-dev \
    libblas-dev liblapack-dev libopenblas-dev \
 && rm -rf /var/lib/apt/lists/*

# Install required R packages; fail build if installation fails so we see errors early
RUN R -e "options(repos='https://cloud.r-project.org'); pkgs <- c('plumber','jsonlite','mirt','purrr','dplyr','tibble','readr','stringr'); install.packages(pkgs); installed <- pkgs %in% installed.packages()[,'Package']; if(!all(installed)) { print('INSTALL_FAILED'); quit(status=1) } else { print('INSTALL_OK') }"

# Copy scripts into the image
WORKDIR /srv
# copy scripts from the build context (workflow uses ./src/services/worker as context)
COPY scripts/ /srv/scripts/

EXPOSE 8000
CMD ["Rscript", "/src/scripts/irt_api.R"]