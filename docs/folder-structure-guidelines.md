# Folder Structure Guideline

## Root folder structure

    .
    ├── docs                    # Documentation files
    ├── src                     # Source files
    ├── LICENSE
    └── README.md

## Source folder structure

    .
    ├── web-api                 # Web API files
    ├── services                # Main application logic
    ├── db                      # Database files    
    ├── telegram                # Telegram bot files
    └── viber                   # Viber bot files

## Module folder structure

    .
    └── test                    # Automated tests


#### Example

    .                          # Root folder
    ├── ...
    ├── src                    # Source folder
    │   ├── ...
    │   ├── telegram           # Telegram bot folder
    │   │   ├── ...
    │   │   ├── test           # Telegram test files and folders
    │   │   └── ...
    │   └── ...
    └── ...

Guideline is based on [Folder Structure Conventions](https://github.com/kriasoft/Folder-Structure-Conventions/blob/master/README.md)
