from functions.run_python_file import run_python_file

def main():
    result1 = run_python_file("calculator", "main.py")
    print(result1)
    print('===================================================================')
    
    result2 = run_python_file("calculator", "main.py", ["3 + 5"])
    print(result2)
    print('===================================================================')

    result3 = run_python_file("calculator", "tests.py")
    print(result3)
    print('===================================================================')

    result4 = run_python_file("calculator", "../main.py")
    print(result4)
    print('===================================================================')

    result5 = run_python_file("calculator", "nonexistent.py")
    print(result5)
    print('===================================================================')

    result6 = run_python_file("calculator", "lorem.txt")
    print(result6)


main()
