# Ground Station Software Setup
## Software Tools to Install
* [VS Code](https://code.visualstudio.com/)
* [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  * For the Windows git installer, the default options are fine.
* [Python 3](https://docs.python-guide.org/starting/installation/)
  * For now, you don't need to install any virtual environment tools

## Git Configuration
1. Using Terminal/Command Prompt, configure your identity for git commits:
```bash
git config --global user.name "John Doe"
git config --global user.email johndoe@example.com
```
2. **If on Linux**, set up credential/password caching for git: 
```bash
git config --global credential.helper 'cache --timeout=10000000'
# Set the cache to timeout after 10 million seconds = 16 weeks
```
Newer installations of git for Windows and Mac enable this automatically, but [here are directions](https://help.github.com/en/articles/caching-your-github-password-in-git) if you need to set it up.

## Additional Prerequisites
* [Node.js & npm ("Current" version)](https://nodejs.org/en/)
  * on Linux:
    ```bash
    curl -sL https://deb.nodesource.com/setup_12.x -o nodesource_setup.sh
    sudo bash nodesource_setup.sh
    sudo apt-get install -y nodejs
    rm nodesource_setup.sh
    sudo chown -R $(whoami) ~/.npm
    ```
  * **IMPORTANT**: On Windows, Node installation might break your Python launcher file association, causing all your scripts to run with Python 2 (yuck). Fix it by running this in Command Prompt:
    ```bash
    ftype Python.File="py.exe" "%1" %*
    ```

## Clone the Repository
1. Open VS Code
2. Type ```Cmd/Ctrl+Shift+P``` to open the Command Pallette.
3. Type "clone"  and hit enter to select "Git: Clone"
4. Paste https://github.com/uas-at-ucla/ground-station.git for the repository URL.
5. Enter your GitHub username and password if prompted.
![vscode-git-clone.png](https://uasatucla.org/images/docs/software/tutorials/environment_setup/vscode-git-clone.png)
6. Click "**Open**" in the bottom right to open the cloned folder.
7. Click "**Open Workspace**" to load the workspace settings.
8. Click "**Install All**" to install the recommended extensions for the ground-station project.
![vscode-install-recommended-extensions.png](https://uasatucla.org/images/docs/software/tutorials/environment_setup/vscode-install-recommended-extensions.png)

## NPM Dependency Installation
1. Open a terminal to the ground-station folder. The easiest way to do this is by typing ```Ctrl+`(backtick)``` or selecting ```View -> Terminal``` from VS Code.
2. To install dependencies for the ground station projects, run:
  ```bash
  ./ground.py build
  ```
  This will take a while.

## Running Code
The ```ground.py``` script has various options to build/run different ground station projects. Try ```./ground.py --help``` and ```./ground.py run --help```.
### Ground Station UI - "FlightDeck"
```bash
./ground.py run ui
```
### More coming soon!

## Editing Code
If you open a '.ts' (TypeScript) file in the **ui** project, you should notice some handy features made possible by the eslint VS Code extension as well as the .eslintrc.json config file:
  * Various warnings/errors are shown that catch potential problems and enforce best practices. It's ok to have some warnings, but they should often be addressed.
  * Whenever you save a file, it is auto-formatted.
