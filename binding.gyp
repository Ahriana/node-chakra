{
  "targets": [
    {
      "include_dirs" : [
        "<!(node -e \"require('nan')\")"
      ],
      "target_name": "node-chakra",
      "libraries": [
        './../tmp/headers/ChakraCore.lib'
      ],
      "sources": [ "./src/index.cpp" ]
    }
  ]
}