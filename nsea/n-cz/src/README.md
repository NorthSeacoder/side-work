A Commitizen adapter for Commitizen

## Installation

```bash
npm i -D commitizen @nsea/cz
```


## Usage

```json
//package.json
{
    "scripts": {
        "cz": "git add . && git-cz"
    },
    "config": {
        "commitizen": {
            "path": "./n-cz/dist/index.js"
        }
    }
}
```

## Configuration

- this adapter will gengrate commit-message as '[scope][type] message'

Add the following to your `czrc.json`:

```json

{
    "scopes":[],//{name,value}
    "defaultScope": [
        {"name": "项目甲", "value": "one"},
        {"name": "项目乙", "value": "two"}
    ]
}
```
scope will be input when scopes is [] or undefined
- support pnpm-workspack
czrc.json can be null with pnpm-workspack.yaml
    - commit-message as '[workspace][subproject] type: message'
e.g.
```
- packages
    - pro1
    - pro2
msg:[packages][pro1] init: xxx
```
