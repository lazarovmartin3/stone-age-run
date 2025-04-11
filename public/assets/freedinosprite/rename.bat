@echo off
setlocal enabledelayedexpansion

:: Loop through each file in the folder
for %%f in (*.*) do (
    set "filename=%%~nxf"
    
    :: Check if the filename contains the pattern "( number )"
    for /f "tokens=1,* delims=(" %%a in ("!filename!") do (
        set "name=%%a"
        set "rest=%%b"
        
        :: Check if the filename ends with the right pattern
        if "!rest!" neq "" (
            set "number=!rest:~0,1!"
            set "newnumber=!number!"

            :: Adjust the number from 1-8 to 0-7
            if !number! geq 1 if !number! leq 8 (
                set /a newnumber=!number!-1
            )

            :: Construct the new filename without the closing parenthesis
            ren "%%f" "!name!_!newnumber!!rest:~1,-1!"
        )
    )
)

endlocal
