[Permalink](http://volbivouac.free.fr/challengeCHVD/README.html "Permalink to README Challenge CHVD devel")

# README Challenge CHVD devel

## Les choix techniques

L'idée la base c'était de découvrir les diffrentes techniques pour avoir un site
web dynamique. Il n'est donc pas impossible que certains choix techniques ne
soient pas très appropriés. J'ai peut-être pris une hache pour couper du pain
mais bon, ça coupe. Je me suis donc mis JQery et AJAX pour le coté client et la
combinaison PHP plus SQlite3 du cot du serveur.
  
Le code est visible sur http://volbivouac.free.fr/challengeCHVD

## Ce qui fonctionne 

*   Un script PHP permet de générer les diffrentes bases de données utilisées
à partir du fichier CSV des sommets 2011. Ce script initialise les tables
**SOMMETS** et **MASSIFS** décrites dans le point suivant. Il est complètement
indépendant du site web et n'a pas d'utilité autre que génrer le fichier
initial pour la base de donne. Il est appel en mode console par la commande
"php create_database.php". 

*   La tables utilises sont les suivantes:  

    SOMMETS 
    
    S_ID: INTEGER, la clé
    
    S_NOM: TEXT, le nom du sommet
    
    S_MID: INTEGER, la clé du massif associée au sommet
    
    S_ALTI: INTEGER, utilisé à titre indicatif
    
    S_PTS: INTEGER, les points rapport par le sommet
    
    S_ANNEE: INTEGER, utilisé dans le calcul du bonus des nouveaux sommets
    
    S_COMMENT: TEXT, utilisé pour préciser des particularités
    
    MASSIFS 
    
    M_ID: INTEGER, la clé
    
    M_NOM: TEXT, le nom du massif
    
    PILOTES 
    
    P_ID: INTEGER, la clé
    
    P_PSEUDO: TEXT, le pseudo utilisé pour l'affichage des résultats
    
    VOLSRANDOS 
    
    V_ID: INTEGER, la clé
    
    V_SID: INTEGER, la clé du sommet associée au vol
    
    V_PID: INTEGER, la clé du pilote associée au vol
    
    V_DATE: INTEGER, utilisation des timestamps Unix
    
    V_BI: INTEGER, vol effectué en biplace, utilisé pour la bonification
    
    V_BUT: REAL, compte pour 1/2 point de bonification
    
    V_CO2: INTEGER, 0 = mobilite douce, 1: pas douce. Utilisé titre informatif
    
    V_COMMENT: TEXT, utilis par pilote pour donner des infos sur un nouveau
               déco ou faire une réclamation

*   La page principale *index.php* est écrite en HTML. Les requêtes au serveur
se font en AJAX. Les menus déroulants sont crées dynamiquement. La gestion des
différentes zones de saisies (grises ou pas) et faite en javascript. La
validation du vol rando passe également par du javascript. La mise en page et
son contenu sont décrits dans ["Mise en page et contenu des pages"][2]. 

## Ce qu'il reste faire 

*   La vérification par la fonction check_volrando() des informations passées.
Si les infos sont bonnes on envoit le vol au serveur pour l'ajout dans la base
de donnée. Pour l'instant la vérification est minimaliste mais elle permet de
voir si tout est correct. Le vol n'est pas encore enregistré dans la base, il
est simplement affiché dans la zone de la console.
 
*   L'affichage des vols et du classement avec la possibilté de filtre et de
    tris. 

*   Amliorer le tout... 

J'ai tout séparé en trois pages. 

*   Une page principale (HTML %2B JS) qui a pour but d'afficher le réglement,
    une zone de saisie et l'affichage des résultats. 
*   Une page de règlement (HTML) qui affiche ... le règlement 2012. 
*   Des scripts PHP qui servent interroger la base de données. Le résultat est
    envoyé au client via des requêtes XMLHttpRequest. 

### La page principale 

La page principales est décomposée en trois zones. Une zone "bandeau" qui permet
de faire une introduction, une zone "contenu" qui sera la zone principale pour
la saisie des données et l'affichage des résultats et enfin une troisième zone
permettant d'afficher le copyright qui n'existe pas. 

#### Le bandeau

Il contient le message de bienvenue, un lien vers le réglement du concours et
un autre lien vers ce fichier 

#### Le contenu 

C'est THE element de notre application. Il contient une partie gauche qui permet
de saisir les informations du vol et une zone de droite permettant d'afficher
les résultats. 

##### La zone de saisie du vol 

A écrire ... 

##### La zone d'affichage des rsultats 

A écrire ... 

#### Le pied 

Qui ne sert rien sauf le prendre ... 

### Le rglement 

Le réglement qui n'est pas jour. Pour l'instant c'est celui de 2011. Il reste
discuter des points de bonus.

 [2]: http://volbivouac.free.fr#MiseEnPage
