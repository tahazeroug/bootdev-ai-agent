from functions.get_file_content import get_file_content

def main():
    lorem = get_file_content("calculator", "lorem.txt")
    print("lorem length:", len(lorem))
    print("lorem truncated marker present:", "truncated at" in lorem)
    print("lorem tail:", lorem[-80:])

    print(get_file_content("calculator", "main.py")[:200])
    print(get_file_content("calculator", "pkg/calculator.py"))
    print(get_file_content("calculator", "/bin/cat"))
    s = get_file_content("calculator", "pkg/does_not_exist.py")
    print(repr(s))

main()
