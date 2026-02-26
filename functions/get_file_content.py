import os
from google.genai import types
from config import MAX_CHARS


schema_get_file_content = types.FunctionDeclaration(
    name="get_file_content",
    description="Retrieves the content of a specified file within the working directory.",
    parameters=types.Schema(
        type=types.Type.OBJECT,
        properties={
            "file_path": types.Schema(
                type=types.Type.STRING,
                description="The relative path of the specific file whose content is to be retrieved.",
            ),
        },
        required=["file_path"],
    ),
)

def get_file_content(working_directory, file_path):
    try:
        working_dir_abs = os.path.abspath(working_directory)
        target_file = os.path.normpath(os.path.join(working_dir_abs, file_path))
        valid_target_file = os.path.commonpath([working_dir_abs, target_file]) == working_dir_abs

        if valid_target_file is False:
            return f'Error: Cannot read "{file_path}" as it is outside the permitted working directory'

        if os.path.isfile(target_file) is False:
            return f'Error: File not found or is not a regular file: "{file_path}"'


        with open(target_file, 'r') as f:
            content = f.read(MAX_CHARS)
            if f.read(1):
                content += f'[...File "{file_path}" truncated at {MAX_CHARS} characters]'
            return content


    except Exception as e:
        return f"Error: {e}"
