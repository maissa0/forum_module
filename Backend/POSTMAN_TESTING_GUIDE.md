# 🚀 Guide de Test Postman - Forum Backend API

## 📋 Informations Générales

- **Base URL**: `http://localhost:8081`
- **Base de données**: MongoDB (mongodb://localhost:27017/forumdb)
- **Port**: 8081
- **Authentification**: Basic Auth (admin/admin) pour les endpoints protégés

---

## 🔐 Configuration Postman

### Variables d'environnement à configurer dans Postman :
```
BASE_URL: http://localhost:8081
USERNAME: admin
PASSWORD: admin
```

### Headers par défaut :
```
Content-Type: application/json
Authorization: Basic {{auth_token}}
```

---

## 📚 Endpoints de l'API

### 1. 🔑 Authentification

#### POST - Créer un compte utilisateur
```
POST {{BASE_URL}}/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123",
  "email": "test@example.com",
  "role": "USER"
}
```

#### POST - Se connecter
```
POST {{BASE_URL}}/api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

---

### 2. 📅 Gestion des Rendez-vous (Appointments)

#### GET - Récupérer tous les rendez-vous
```
GET {{BASE_URL}}/api/appointments
Authorization: Basic {{auth_token}}
```

#### GET - Récupérer un rendez-vous par ID
```
GET {{BASE_URL}}/api/appointments/{{appointment_id}}
Authorization: Basic {{auth_token}}
```

#### POST - Créer un nouveau rendez-vous
```
POST {{BASE_URL}}/api/appointments
Content-Type: application/json
Authorization: Basic {{auth_token}}

{
  "title": "Rendez-vous avec le professeur",
  "date": "2024-01-15",
  "time": "14:30",
  "role": "Teacher"
}
```

#### PUT - Mettre à jour un rendez-vous
```
PUT {{BASE_URL}}/api/appointments/{{appointment_id}}
Content-Type: application/json
Authorization: Basic {{auth_token}}

{
  "title": "Rendez-vous modifié",
  "date": "2024-01-16",
  "time": "15:00",
  "role": "Teacher"
}
```

#### DELETE - Supprimer un rendez-vous
```
DELETE {{BASE_URL}}/api/appointments/{{appointment_id}}
Authorization: Basic {{auth_token}}
```

---

### 3. 💬 Gestion des Commentaires (Comments)

#### GET - Récupérer tous les commentaires
```
GET {{BASE_URL}}/api/comments
Authorization: Basic {{auth_token}}
```

#### GET - Récupérer un commentaire par ID
```
GET {{BASE_URL}}/api/comments/{{comment_id}}
Authorization: Basic {{auth_token}}
```

#### POST - Créer un nouveau commentaire
```
POST {{BASE_URL}}/api/comments
Content-Type: application/json
Authorization: Basic {{auth_token}}

{
  "userId": "user123",
  "text": "Excellent commentaire !",
  "likes": 0,
  "createdDate": "2024-01-15"
}
```

#### PUT - Mettre à jour un commentaire
```
PUT {{BASE_URL}}/api/comments/{{comment_id}}
Content-Type: application/json
Authorization: Basic {{auth_token}}

{
  "userId": "user123",
  "text": "Commentaire modifié !",
  "likes": 5,
  "createdDate": "2024-01-15"
}
```

#### DELETE - Supprimer un commentaire
```
DELETE {{BASE_URL}}/api/comments/{{comment_id}}
Authorization: Basic {{auth_token}}
```

---

### 4. ⭐ Gestion des Évaluations (Ratings)

#### GET - Récupérer toutes les évaluations
```
GET {{BASE_URL}}/api/ratings
Authorization: Basic {{auth_token}}
```

#### GET - Récupérer une évaluation par ID
```
GET {{BASE_URL}}/api/ratings/{{rating_id}}
Authorization: Basic {{auth_token}}
```

#### POST - Créer une nouvelle évaluation
```
POST {{BASE_URL}}/api/ratings
Content-Type: application/json
Authorization: Basic {{auth_token}}

{
  "userId": "user123",
  "targetType": "Comment",
  "targetId": "comment456",
  "ratingValue": 5,
  "comment": "Très bonne évaluation !"
}
```

#### PUT - Mettre à jour une évaluation
```
PUT {{BASE_URL}}/api/ratings/{{rating_id}}
Content-Type: application/json
Authorization: Basic {{auth_token}}

{
  "userId": "user123",
  "targetType": "Comment",
  "targetId": "comment456",
  "ratingValue": 4,
  "comment": "Évaluation mise à jour"
}
```

#### DELETE - Supprimer une évaluation
```
DELETE {{BASE_URL}}/api/ratings/{{rating_id}}
Authorization: Basic {{auth_token}}
```

---

### 5. 💬 Chat en Temps Réel (WebSocket)

#### Endpoint WebSocket
```
ws://localhost:8081/chat
```

#### Configuration STOMP
- **Destination d'envoi**: `/app/chat`
- **Destination d'écoute**: `/topic/messages`

#### Message de test
```json
{
  "senderId": "user123",
  "content": "Bonjour tout le monde !",
  "timestamp": "2024-01-15T14:30:00"
}
```

---

## 🧪 Tests Automatisés Postman

### Collection Postman à importer

Créez une nouvelle collection dans Postman et ajoutez ces tests :

#### Test de santé de l'API
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});
```

#### Test de création d'utilisateur
```javascript
pm.test("User created successfully", function () {
    pm.response.to.have.status(200);
    pm.expect(pm.response.text()).to.include("User registered successfully");
});
```

#### Test de validation des données
```javascript
pm.test("Response has required fields", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData).to.have.property('username');
});
```

---

## 🔧 Configuration MongoDB

### Vérifier que MongoDB est en cours d'exécution
```bash
# Windows
net start MongoDB

# Ou vérifier le processus
netstat -an | findstr :27017
```

### Base de données créée automatiquement
- **Nom**: `forumdb`
- **Collections**: `users`, `appointments`, `comments`, `ratings`, `chat_messages`

---

## 🚀 Démarrage de l'Application

### 1. Compiler le projet
```bash
mvn clean compile
```

### 2. Lancer l'application
```bash
mvn spring-boot:run
```

### 3. Vérifier que l'application fonctionne
```bash
curl http://localhost:8081/api/appointments
```

---

## 📝 Exemples de Données de Test

### Utilisateurs de test
```json
[
  {
    "username": "admin",
    "password": "admin123",
    "email": "admin@forum.com",
    "role": "ADMIN"
  },
  {
    "username": "teacher",
    "password": "teacher123",
    "email": "teacher@forum.com",
    "role": "TEACHER"
  },
  {
    "username": "student",
    "password": "student123",
    "email": "student@forum.com",
    "role": "STUDENT"
  }
]
```

### Rendez-vous de test
```json
[
  {
    "title": "Consultation pédagogique",
    "date": "2024-01-20",
    "time": "10:00",
    "role": "Teacher"
  },
  {
    "title": "Suivi académique",
    "date": "2024-01-21",
    "time": "14:30",
    "role": "Responsible"
  }
]
```

---

## ⚠️ Dépannage

### Erreurs courantes

#### Port 8080 déjà utilisé
```bash
# Trouver le processus
netstat -ano | findstr :8080

# Arrêter le processus
taskkill /PID <PID> /F
```

#### MongoDB non accessible
```bash
# Vérifier le service MongoDB
net start MongoDB

# Vérifier la connexion
mongo --host localhost --port 27017
```

#### Erreurs de compilation
```bash
# Nettoyer et recompiler
mvn clean compile

# Vérifier la version Java
java -version
```

---

## 📊 Monitoring et Logs

### Logs de l'application
Les logs sont affichés dans la console lors du démarrage avec `mvn spring-boot:run`

### Endpoints de monitoring
- **Health Check**: `GET /actuator/health` (si Spring Boot Actuator est configuré)
- **Info**: `GET /actuator/info`

---

## 🎯 Prochaines Étapes

1. **Tester tous les endpoints** avec Postman
2. **Vérifier la persistance** des données dans MongoDB
3. **Tester les WebSockets** avec un client STOMP
4. **Intégrer avec le frontend Angular**
5. **Déployer en production**

---

## 📞 Support

En cas de problème :
1. Vérifier les logs de l'application
2. Vérifier la connexion MongoDB
3. Vérifier que tous les ports sont libres
4. Consulter la documentation Spring Boot

---

*Document créé pour le projet Forum Backend - MongoDB*
