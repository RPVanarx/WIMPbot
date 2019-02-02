# Folder Structure Guideline

## Root folde structure

    .
    ├── build                   # Compiled files
    ├── docs                    # Documentation files
    ├── src                     # [Source files](#root-source-folder)
    ├── LICENSE
    └── README.md

## Root source folder

    .
    ├── web-api                 # Web API files
    ├── business-logic          # Main application logic
    ├── db                      # Database files    
    ├── telegramm               # Telegramm bot files
    └── viber                   # Viber bot files

## Each folder (module) in root source folder

    .
    ├── build                   # Compiled files
    ├── docs                    # Documentation files (specific docs)
    ├── src                     # Source files
    ├── test                    # Automated tests
    ├── tools                   # Tools and utilities
    └── README.md               # Short description of module and link to the main documentation file

Guideline is based on [Folder Structure Conventions](https://github.com/kriasoft/Folder-Structure-Conventions/blob/master/README.md)
