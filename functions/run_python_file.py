import os
import subprocess
from google.genai import types

schema_run_python_file = types.FunctionDeclaration(
    name="run_python_file",
    description="Executes a specified Python file within the working directory and returns its output.",
    parameters=types.Schema(
        type=types.Type.OBJECT,
        properties={
            "file_path": types.Schema(
                type=types.Type.STRING,
                description="The relative path of the Python script designated for execution.",
            ),
            "args": types.Schema(
                type=types.Type.ARRAY,
                items=types.Schema(type=types.Type.STRING),
                description="An optional sequence of command-line arguments to be passed to the script during its execution.",
            )
        },
        required=["file_path"],
    ),
)

def run_python_file(working_directory, file_path, args=None):
    try:
        working_dir_abs = os.path.abspath(working_directory)
        target_path = os.path.normpath(os.path.join(working_dir_abs, file_path))
        validate_target_path = os.path.commonpath([working_dir_abs, target_path]) == working_dir_abs
        
        if validate_target_path is False:
            return f'Error: Cannot execute "{file_path}" as it is outside the permitted working directory'

        if os.path.isfile(target_path) is False:
            return f'Error: "{file_path}" does not exist or is not a regular file'

        if target_path.endswith('.py') is False:
            return f'Error: "{file_path}" is not a Python file'

        command = ["python", os.path.abspath(target_path)]

        if args:
            command.extend(args)

        result = subprocess.run(command, cwd=working_dir_abs, capture_output=True, text=True, timeout=30)

        final_result = ""

        if result.returncode != 0:
            final_result += f"Process exited with code {result.returncode}\n"

        if not result.stdout.strip() and not result.stderr.strip():
            final_result += "No output produced\n"
        
        if result.stdout != "":
            final_result += f"STDOUT: {result.stdout}\n"
        if result.stderr != "":
            final_result += f"STDERR: {result.stderr}\n"

        return final_result

    except Exception as e:
        return f"Error: executing Python file: {e}"
