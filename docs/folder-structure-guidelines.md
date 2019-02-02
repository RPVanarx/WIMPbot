# Folder Structure Guideline

## Root folder structure

    .
    ├── docs                    # Documentation files
    ├── src                     # Source files
    ├── LICENSE
    └── README.md

## Root source folder

    .
    ├── web-api                 # Web API files
    ├── business-logic          # Main application logic
    ├── db                      # Database files    
    ├── telegram                # Telegram bot files
    └── viber                   # Viber bot files

## Each folder (module) in root source folder

    .
    ├── docs                    # Documentation files (specific docs. not necessary)
    ├── src                     # Source files
    ├── test                    # Automated tests
    ├── tools                   # Tools and utilities (no necessary)
    └── README.md               # Short description of current module and link to the main documentation file


#### Example

    .                          # Root folder
    ├── ...
    ├── src                    # Root source folder
    │   ├── ...
    │   ├── telegram           # Telegram bot folder
    │   │   ├── ...
    │   │   ├── src            # Telegram source files and folders
    │   │   ├── test           # Telegram test files and folders
    │   │   └── ...
    │   └── ...
    └── ...

Guideline is based on [Folder Structure Conventions](https://github.com/kriasoft/Folder-Structure-Conventions/blob/master/README.md)
