# BookService

Сервис для управления книгами. Поддерживает JWT авторизацию и регистрацию с подтверждением почты.
Для запуска нужно заполнить .env файл.

Запустить через docker compose:

```
docker compose up -d
```

Для запуска миграций нужно зайти в контейнер:

```
docker exec -it bookservice_server /bin/ash
```

И выполнить команду:

```
npx prisma migrate dev --name init
```

Также для заполнения начальными данными (книгами и аккаунтом администратора) нужно выполнить:

```
npm run prisma:seed
```

Выход `[Ctrl + D]`

Для авторизации под администратором используйте реквизиты:

```
{
	"username": "admin",
	"password": "Admin123"
}
```

API соответствует требованиям. Особенности:

- После регистрации на указанную почту придёт ссылка для активации аккаунта.
- При добавлении или удалении книги дата в `publicationDate` может быть указана в формате `2001-01-01`
- При изменении роли пользователя, маску роли можно указывать в формате цифры (`{role: 2}`) или двоичной строки (`{role: "10"}`). Администратор имеет маску `10`, обычный пользователь `01`.
