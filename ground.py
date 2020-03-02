#!/usr/bin/env python3

import os
import sys
import argparse
import subprocess
import shutil

from tools import npm_install

npm_cmd = shutil.which("npm") # For Windows compatibility

def exit_if_error(*args, **kwargs):
    exit_code = subprocess.call(*args, **kwargs)
    if exit_code != 0:
        sys.exit(exit_code)

def build_parent_node_project():
    os.chdir("node_projects")
    npm_install.npm_install()
    os.chdir("..")

def build_ui():
    build_parent_node_project()
    os.chdir("node_projects/ui")
    npm_install.npm_install()
    os.chdir("../..")

def build_server():
    build_parent_node_project()
    os.chdir("node_projects/server")
    npm_install.npm_install()
    os.chdir("../..")

def build(args=None):
    build_ui()
    build_server()

def run_all(args):
    build()
    exit_if_error([npm_cmd, "start"], cwd="node_projects")

def run_server(args):
    build_server()
    exit_if_error([npm_cmd, "start"], cwd="node_projects/server")

def run_ui(args):
    build_ui()
    # run start-web (w/o Electron) if web option specified. Otherwise, run start (w/ Electron).
    exit_if_error([npm_cmd, "run", "start"+args.web], cwd="node_projects/ui")

def deploy_win(args):
    build_ui()
    exit_if_error([npm_cmd, "run", "package-win"], cwd="node_projects/ui")

def deploy_mac(args):
    build_ui()
    exit_if_error([npm_cmd, "run", "package-mac"], cwd="node_projects/ui")

def deploy_linux(args):
    build_ui()
    exit_if_error([npm_cmd, "run", "package-linux"], cwd="node_projects/ui")

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.realpath(__file__)))

    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers(dest='option')
    subparsers.required = True
    subparsers.add_parser('build').set_defaults(func=build)

    run_parser = subparsers.add_parser('run')
    run_parser.set_defaults(func=run_all)
    run_parser.add_argument('--web', action='store_const', const="-web", default="")
    run_subparsers = run_parser.add_subparsers()

    run_subparsers.add_parser('all')
    run_subparsers.add_parser('server').set_defaults(func=run_server)
    run_subparsers.add_parser('ui').set_defaults(func=run_ui)

    deploy_win_parser = subparsers.add_parser('deploy-win')
    deploy_win_parser.set_defaults(func=deploy_win)

    deploy_mac_parser = subparsers.add_parser('deploy-mac')
    deploy_mac_parser.set_defaults(func=deploy_mac)

    deploy_linux_parser = subparsers.add_parser('deploy-linux')
    deploy_linux_parser.set_defaults(func=deploy_linux)

    args = parser.parse_args()
    args.func(args)
