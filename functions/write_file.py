import os
from google.genai import types

schema_write_file = types.FunctionDeclaration(
    name="write_file",
    description="Writes text content to a specified file within the working directory, overwriting it if it already exists.",
    parameters=types.Schema(
        type=types.Type.OBJECT,
        properties={
            "file_path": types.Schema(
                type=types.Type.STRING,
                description="The relative path of the file to be created or updated with new content.",
            ),
            "content": types.Schema(
                type=types.Type.STRING,
                description="The textual data to be written into the specified file.",
            )
        },
        required=["file_path", "content"],
    ),
)

def write_file(working_directory, file_path, content):
    try:
        working_dir_abs = os.path.abspath(working_directory)
        target_path = os.path.normpath(os.path.join(working_dir_abs, file_path))
        validate_target_path = os.path.commonpath([working_dir_abs, target_path]) == working_dir_abs

        if validate_target_path is False:
            return f'Error: Cannot write to "{file_path}" as it is outside the permitted working directory'
        if os.path.isdir(target_path) is True:
            return f'Error: Cannot write to "{file_path}" as it is a directory'

        os.makedirs(os.path.dirname(target_path), exist_ok=True)

        with open(target_path, "w") as f:
            f.write(content)
            return f'Successfully wrote to "{file_path}" ({len(content)} characters written)'

        return content

    except Exception as e:
        return f"Error: {e}"
