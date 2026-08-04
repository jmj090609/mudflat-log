@echo off
set "PATH=C:\Users\HAVE A GOOD DAY^^\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%"
set "WRANGLER_LOG_PATH=.wrangler\wrangler.log"
call node_modules\.bin\vinext.cmd dev
