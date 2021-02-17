# utils
## Github Workflows

Il existe 3 workflows :
- ## Generate Dev version
    Ce workflow permet de generer un version Major, Minor ou Patch avec le dernier commit present sur la branch dev, une fois que l'exection du workflow aura reussi, un nouveau tag sera present avec le format : dev_x.x.xxx
- ## Generate Master Version
    Ce workflow permet de mettre a jour la branche master avec la dernier version de la branche dev, seulement le dossier dist, et le fichier package.json seron mis a jour, une fois que l'execution du worklflow aura reussi , un nouveau tag sera present au format :  x.x.xxx; 

    Ce workflow n'aura de resussite que s'il y a une nouvelle version dans la branche dev, autrement il sera en echec

- ## Standard Pipeline
    Ce workflow est destine a executer des jobs de verification du code avec les scripts npm ci, npm build et npm testing
