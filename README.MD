## Cineflix - basic ticket reservation system
Basic cinema ticket reservation system with simple cms.
I coded it in 2020 for Server Applications course in Upper-Secondary Schools of Communications.
## Additional information about project
### Run
- To run this project you need Apache + MySQL Server
- To build this project type in `cineflix` directory `npm run build`
### Used technology
- HTML, CSS, JavaScript
- React
- PHP
## Some things that I learned:
- React Router + React Switch
- practical PHP


## Original README (in Polish 🇵🇱):

### Ogólne informacje
Projekt został wykonany przy użyciu PHP wraz z React'em, Sass'em oraz api Youtube. Każde pobranie informacji następowało za pośrednictwem api napisanego w phpie. Po za rezerwacją miejsc na nr telefonu i imię dodałem jeszcze mechanizm logowania i rejestracji oparty o php sessions. Ponadto każde hasło jest hashowane, a ścieżki do plików php nie wymagają pisania rozszerzenia ".php".

> Aby  **dodać seans** trzeba najpierw zalogować się na konto administratora w zakładce "**Konto**". Następnie w panelu po lewej stronie kliknąć "**Dodaj seans**".

Formularz do dodawania seansów oraz filmów jest walidowany po obu stronach (serwer i klient) tak, aby seanse nie mogły na siebie nachodzić. Jeśli zostaną wykryte jakieś kolizje, formularz na pewno o tym poinformuje.

> Aby  **dodać film** podobnie jak wcześniej trzeba się zalogować i kliknąć w "**Dodaj film**".  **Uwaga!** Aby dodać nowy film potrzebny jest  **pionowy plakat** png lub jpg oraz  **YoutubeID** (na samym dole informacja czym jest)

> Aby  **zarezerwować bilety** należy najpierw wybrać film dostępny na stronie głównej ( "/" lub /movies ). Następnie na stronie poświęconej konkretnemu filmowi klikamy "**Zarezerwuj**" lub zjeżdżamy na dół strony i wybieramy seans, który nas interesuje (jeśli istnieje). Rezerwacja podlega także walidacji w czasie rzeczywistym po stronie klienta, a także w momencie wysłania formularza jest weryfikowane, czy miejsca nie stały sie w międzyczasie zajęte.

  

Można zarezerwować bilety i na imię z numerem telefonu, i na adres email czyli na utworzone konto w zakładce /account. Rezerwacja przypisywana jest do jednego połączenia (tj. imię - nr tel lub login - hasło). Można ją sprawdzić w zakładce "**Sprawdź rezerwację**" lub pod linkiem

  

### Dane do logowania 

> Domyślne dane logowania do administratora strony (dla takich danych w chrome może wyskakiwać alert o mało bezpiecznych danych):
**login**:
admin
**hasło**
admin

> Alternatywa (tu już chrome powinien być spokojniejszy):
**login:**
nauczyciel
**hasło:**
zaq1@WSX

> Domyślne dane logowania do przykładowego użytkownika strony:
**login**:
user
**hasło**
user

  

### Struktura projektu 

Pliki projektu podzielone są na 3 główne foldery:

**api** - część backendowa

**cineflix** - część frontendowa

**dist** - folder, do którego po skompilowaniu części frontendowej wrzucam wszystkie niezbędne pliki

  

Całe api znajduje się wewnątrz folderu  **/api**

Skrótowy opis podfolderów  **/api**  :

**/account**  - część odpowiedzialna za logowanie i uwierzytelnianie

**/add** - część przeznaczona tylko dla admina, służy dodawaniu nowych elementów

**/posters** - folder przechowujący wszelkie plakaty (podobno taki folder działa szybciej niż przechowywanie grafik bezpośrednio w bazie)

**/reserve** - część odpowiedzialna za przechwytywanie rezerwacji oraz ich sprawdzanie

**/trivial** - zapytania trywialne, należą do nich dane do strony głównej oraz strony każdego filmu.

**/utilities** - zapytania wykorzystywane do właściwego działania m.in. formularzy dodawających cokolwiek (seans, film, rezerwację)

Ponadto 2 pliki leżą bezpośrednio:
**props.php** - wszystkie ważne zmienne projektu
**voids.php** - wszystkie funkcję projektu.

  

Struktura bazy wraz z relacjami :

![image.png](https://mail.google.com/mail/u/1?ui=2&ik=1c1cf6264a&attid=0.1&permmsgid=msg-a:r-7216269704673739797&th=175f2a3d78cdb2ea&view=fimg&fur=ip&sz=s0-l75-ft&attbid=ANGjdJ9Rk5zslZRj6gWjaXzV8_V4za7kTiIyk4gKyITfqYMMld1Ra1XMpcNohnzLUkdwk6GxOa2gBYgxTKGSeLG_z_AKL5zIGLRBlv7HLaTJh-Mgz1IqirdnpaX_70o&disp=emb&realattid=ii_khtssi3z0)  

  

### Konfiguracja lokalnie 

Zmienne niezbędne do połączenia się z bazą danych są przechowywane w pliku  **/api/props.php**.

Aby uruchomić u siebie, należy przekopiować folder  **jkedra** bezpośrednio do katalogu  **htdocs** tak, aby url strony głównej wyglądał mniej więcej tak :  [http://localhost](http://localhost/jkedra)**/jkedra/**

Ważne jest, by była  **dokładnie taka sama ścieżka jak powyżej**, ze względu na routing React'a i jego wymóg konfiguracji. Nazwa domeny oraz port nie jest ważna, lecz ścieżka (path) musi być dokładnie ten sam. W innym wypadku strona nie będzie działać.

Trzeba także oczywiście zaimportować bazę danych. Na mojej lokalnej maszynie nazywała się ona "**cinema**". Nazwę bazy można zmienić w wcześniej wspomnianym pliku  **props.php**.  

Notatki:
* aby odpalić całą wersję deweloperską, należy najpierw w folderze  cineflix  użyć polecenia  **npm install**, a następnie skonfigurować adres proxy w package.json na adres xamppa i uruchomić "**npm start**". Trochę może zająć sama konfiguracja środowiska.

### Informacje dodatkowe 

- Czasami strona może się długo ładować na podanym na samym początku linku, ze względu na darmowy hosting.

- zagnieżdzone linki (np. /movie/id_filmu) mogą nie działać po bezpośrednim wpisaniu url przez niezbyt dobrą współpracę routingu Reactowego z apache. Lecz poruszanie się po widocznym interfejsie powinno działać bez zarzutu.

-  **Youtube ID**  - jest to identyfikator filmu na youtube, mający max 11 znaków. Znajduje się on w linku do każdego filmu na youtube, np.:  
	- **z parametru v** (kopiowanie bezpośrednio linku): https://www.youtube.com/watch?v=**pmc3EIn7bU4**&ab_channel=KubaKlawiter  

	- **z bezpośredniej ścieżki** (udostępnianie filmu yt):
		https://youtu.be/**pmc3EIn7bU4**  

- dane i plakaty pobrałem z strony cinema-city