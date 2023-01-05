# Getting Started with Create React App

- git status [Thay đổi bao nhiêu file ]
- git remote -v [Lấy link url trên github]
- git remote add origin https://github.com/maithingochan/trello.git
- git remote -v

## Đẩy code lên git
- git add.
- git commit -m "Init Project." 
- git push origin master
## Đây code lên branch
- git branch
- git checkout -b update_readme
- git status
- git add .
- git commit -m "Update reame"
- git push origin update_readme

## Thay đổi code trong branch
- git add .
- git commit --amend
- :wq
- git push origin update_readme -f
## 
- git checkout master
- git push origin master
## xoa branch
- git branch -D update_readme
