export type Locale = 'uk' | 'en' | 'ru' | 'es' | 'fr' | 'de'

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Auth
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Create Account',
    'auth.continueWithGoogle': 'Continue with Google',
    'auth.or': 'OR',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.emailPlaceholder': 'you@example.com',
    'auth.passwordPlaceholder': 'Your password',
    'auth.minChars': 'Min. 6 characters',
    'auth.signingIn': 'Signing in...',
    'auth.creatingAccount': 'Creating account...',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.checkEmail': 'Check your email to confirm your account',
    'auth.signInFailed': 'Sign in failed. Please try again.',
    'auth.signUpFailed': 'Sign up failed. Please try again.',

    // Nav
    'nav.translator': 'Translator',
    'nav.dictionary': 'Dictionary',

    // Profile
    'profile.user': 'User',
    'profile.settings': 'Settings',
    'profile.language': 'Language',
    'profile.theme': 'Theme',
    'profile.light': 'Light',
    'profile.dark': 'Dark',
    'profile.system': 'System',
    'profile.logout': 'Logout',

    // Translator
    'translator.inputPlaceholder': 'Type or paste text here...',
    'translator.outputPlaceholder': 'Translation will appear here...',
    'translator.translating': 'Translating...',
    'translator.addToDictionary': 'Add to Dictionary',
    'translator.characters': 'characters',
    'translator.editText': 'Edit text',

    // Dictionary
    'dictionary.title': 'Dictionary',
    'dictionary.empty': 'Your dictionary is empty',
    'dictionary.search': 'Search words...',
    'dictionary.added': 'added to dictionary',
    'dictionary.deleted': 'Word deleted',
    'dictionary.failedAdd': 'Failed to add word',

    // Settings
    'settings.title': 'Settings',
    'settings.profile': 'Profile',
    'settings.fullName': 'Full Name',
    'settings.saveChanges': 'Save Changes',
    'settings.saving': 'Saving...',
    'settings.profileUpdated': 'Profile updated',
    'settings.updateFailed': 'Failed to update profile',
    'settings.subscription': 'Subscription',
    'settings.freePlan': 'Free Plan',
    'settings.proPlan': 'Pro Plan',
    'settings.upgradeToPro': 'Upgrade to Pro',
  },

  uk: {
    // Auth
    'auth.signIn': 'Увійти',
    'auth.signUp': 'Створити акаунт',
    'auth.continueWithGoogle': 'Продовжити з Google',
    'auth.or': 'АБО',
    'auth.email': 'Електронна пошта',
    'auth.password': 'Пароль',
    'auth.emailPlaceholder': 'you@example.com',
    'auth.passwordPlaceholder': 'Ваш пароль',
    'auth.minChars': 'Мін. 6 символів',
    'auth.signingIn': 'Входимо...',
    'auth.creatingAccount': 'Створюємо акаунт...',
    'auth.noAccount': 'Немає акаунту?',
    'auth.hasAccount': 'Вже є акаунт?',
    'auth.checkEmail': 'Перевірте електронну пошту для підтвердження акаунту',
    'auth.signInFailed': 'Не вдалося увійти. Спробуйте ще раз.',
    'auth.signUpFailed': 'Не вдалося створити акаунт. Спробуйте ще раз.',

    // Nav
    'nav.translator': 'Перекладач',
    'nav.dictionary': 'Словник',

    // Profile
    'profile.user': 'Користувач',
    'profile.settings': 'Налаштування',
    'profile.language': 'Мова',
    'profile.theme': 'Тема',
    'profile.light': 'Світла',
    'profile.dark': 'Темна',
    'profile.system': 'Системна',
    'profile.logout': 'Вийти',

    // Translator
    'translator.inputPlaceholder': 'Введіть або вставте текст тут...',
    'translator.outputPlaceholder': 'Переклад з\'явиться тут...',
    'translator.translating': 'Перекладаємо...',
    'translator.addToDictionary': 'Додати до словника',
    'translator.characters': 'символів',
    'translator.editText': 'Редагувати текст',

    // Dictionary
    'dictionary.title': 'Словник',
    'dictionary.empty': 'Ваш словник порожній',
    'dictionary.search': 'Шукати слова...',
    'dictionary.added': 'додано до словника',
    'dictionary.deleted': 'Слово видалено',
    'dictionary.failedAdd': 'Не вдалося додати слово',

    // Settings
    'settings.title': 'Налаштування',
    'settings.profile': 'Профіль',
    'settings.fullName': 'Повне ім\'я',
    'settings.saveChanges': 'Зберегти зміни',
    'settings.saving': 'Зберігаємо...',
    'settings.profileUpdated': 'Профіль оновлено',
    'settings.updateFailed': 'Не вдалося оновити профіль',
    'settings.subscription': 'Підписка',
    'settings.freePlan': 'Безкоштовний план',
    'settings.proPlan': 'Pro план',
    'settings.upgradeToPro': 'Оновити до Pro',
  },

  ru: {
    // Auth
    'auth.signIn': 'Войти',
    'auth.signUp': 'Создать аккаунт',
    'auth.continueWithGoogle': 'Продолжить с Google',
    'auth.or': 'ИЛИ',
    'auth.email': 'Электронная почта',
    'auth.password': 'Пароль',
    'auth.emailPlaceholder': 'you@example.com',
    'auth.passwordPlaceholder': 'Ваш пароль',
    'auth.minChars': 'Мин. 6 символов',
    'auth.signingIn': 'Входим...',
    'auth.creatingAccount': 'Создаём аккаунт...',
    'auth.noAccount': 'Нет аккаунта?',
    'auth.hasAccount': 'Уже есть аккаунт?',
    'auth.checkEmail': 'Проверьте электронную почту для подтверждения аккаунта',
    'auth.signInFailed': 'Не удалось войти. Попробуйте ещё раз.',
    'auth.signUpFailed': 'Не удалось создать аккаунт. Попробуйте ещё раз.',

    // Nav
    'nav.translator': 'Переводчик',
    'nav.dictionary': 'Словарь',

    // Profile
    'profile.user': 'Пользователь',
    'profile.settings': 'Настройки',
    'profile.language': 'Язык',
    'profile.theme': 'Тема',
    'profile.light': 'Светлая',
    'profile.dark': 'Тёмная',
    'profile.system': 'Системная',
    'profile.logout': 'Выйти',

    // Translator
    'translator.inputPlaceholder': 'Введите или вставьте текст здесь...',
    'translator.outputPlaceholder': 'Перевод появится здесь...',
    'translator.translating': 'Переводим...',
    'translator.addToDictionary': 'Добавить в словарь',
    'translator.characters': 'символов',
    'translator.editText': 'Редактировать текст',

    // Dictionary
    'dictionary.title': 'Словарь',
    'dictionary.empty': 'Ваш словарь пуст',
    'dictionary.search': 'Искать слова...',
    'dictionary.added': 'добавлено в словарь',
    'dictionary.deleted': 'Слово удалено',
    'dictionary.failedAdd': 'Не удалось добавить слово',

    // Settings
    'settings.title': 'Настройки',
    'settings.profile': 'Профиль',
    'settings.fullName': 'Полное имя',
    'settings.saveChanges': 'Сохранить изменения',
    'settings.saving': 'Сохраняем...',
    'settings.profileUpdated': 'Профиль обновлён',
    'settings.updateFailed': 'Не удалось обновить профиль',
    'settings.subscription': 'Подписка',
    'settings.freePlan': 'Бесплатный план',
    'settings.proPlan': 'Pro план',
    'settings.upgradeToPro': 'Перейти на Pro',
  },

  es: {
    // Auth
    'auth.signIn': 'Iniciar sesión',
    'auth.signUp': 'Crear cuenta',
    'auth.continueWithGoogle': 'Continuar con Google',
    'auth.or': 'O',
    'auth.email': 'Correo electrónico',
    'auth.password': 'Contraseña',
    'auth.emailPlaceholder': 'tu@ejemplo.com',
    'auth.passwordPlaceholder': 'Tu contraseña',
    'auth.minChars': 'Mín. 6 caracteres',
    'auth.signingIn': 'Iniciando sesión...',
    'auth.creatingAccount': 'Creando cuenta...',
    'auth.noAccount': '¿No tienes cuenta?',
    'auth.hasAccount': '¿Ya tienes cuenta?',
    'auth.checkEmail': 'Revisa tu correo electrónico para confirmar tu cuenta',
    'auth.signInFailed': 'Error al iniciar sesión. Inténtalo de nuevo.',
    'auth.signUpFailed': 'Error al crear la cuenta. Inténtalo de nuevo.',

    // Nav
    'nav.translator': 'Traductor',
    'nav.dictionary': 'Diccionario',

    // Profile
    'profile.user': 'Usuario',
    'profile.settings': 'Configuración',
    'profile.language': 'Idioma',
    'profile.theme': 'Tema',
    'profile.light': 'Claro',
    'profile.dark': 'Oscuro',
    'profile.system': 'Sistema',
    'profile.logout': 'Cerrar sesión',

    // Translator
    'translator.inputPlaceholder': 'Escribe o pega texto aquí...',
    'translator.outputPlaceholder': 'La traducción aparecerá aquí...',
    'translator.translating': 'Traduciendo...',
    'translator.addToDictionary': 'Añadir al diccionario',
    'translator.characters': 'caracteres',
    'translator.editText': 'Editar texto',

    // Dictionary
    'dictionary.title': 'Diccionario',
    'dictionary.empty': 'Tu diccionario está vacío',
    'dictionary.search': 'Buscar palabras...',
    'dictionary.added': 'añadido al diccionario',
    'dictionary.deleted': 'Palabra eliminada',
    'dictionary.failedAdd': 'Error al añadir la palabra',

    // Settings
    'settings.title': 'Configuración',
    'settings.profile': 'Perfil',
    'settings.fullName': 'Nombre completo',
    'settings.saveChanges': 'Guardar cambios',
    'settings.saving': 'Guardando...',
    'settings.profileUpdated': 'Perfil actualizado',
    'settings.updateFailed': 'Error al actualizar el perfil',
    'settings.subscription': 'Suscripción',
    'settings.freePlan': 'Plan gratuito',
    'settings.proPlan': 'Plan Pro',
    'settings.upgradeToPro': 'Actualizar a Pro',
  },

  fr: {
    // Auth
    'auth.signIn': 'Se connecter',
    'auth.signUp': 'Créer un compte',
    'auth.continueWithGoogle': 'Continuer avec Google',
    'auth.or': 'OU',
    'auth.email': 'E-mail',
    'auth.password': 'Mot de passe',
    'auth.emailPlaceholder': 'vous@exemple.com',
    'auth.passwordPlaceholder': 'Votre mot de passe',
    'auth.minChars': 'Min. 6 caractères',
    'auth.signingIn': 'Connexion en cours...',
    'auth.creatingAccount': 'Création du compte...',
    'auth.noAccount': "Vous n'avez pas de compte ?",
    'auth.hasAccount': 'Vous avez déjà un compte ?',
    'auth.checkEmail': 'Vérifiez votre e-mail pour confirmer votre compte',
    'auth.signInFailed': 'Échec de la connexion. Veuillez réessayer.',
    'auth.signUpFailed': 'Échec de la création du compte. Veuillez réessayer.',

    // Nav
    'nav.translator': 'Traducteur',
    'nav.dictionary': 'Dictionnaire',

    // Profile
    'profile.user': 'Utilisateur',
    'profile.settings': 'Paramètres',
    'profile.language': 'Langue',
    'profile.theme': 'Thème',
    'profile.light': 'Clair',
    'profile.dark': 'Sombre',
    'profile.system': 'Système',
    'profile.logout': 'Se déconnecter',

    // Translator
    'translator.inputPlaceholder': 'Saisissez ou collez du texte ici...',
    'translator.outputPlaceholder': 'La traduction apparaîtra ici...',
    'translator.translating': 'Traduction en cours...',
    'translator.addToDictionary': 'Ajouter au dictionnaire',
    'translator.characters': 'caractères',
    'translator.editText': 'Modifier le texte',

    // Dictionary
    'dictionary.title': 'Dictionnaire',
    'dictionary.empty': 'Votre dictionnaire est vide',
    'dictionary.search': 'Rechercher des mots...',
    'dictionary.added': 'ajouté au dictionnaire',
    'dictionary.deleted': 'Mot supprimé',
    'dictionary.failedAdd': "Échec de l'ajout du mot",

    // Settings
    'settings.title': 'Paramètres',
    'settings.profile': 'Profil',
    'settings.fullName': 'Nom complet',
    'settings.saveChanges': 'Enregistrer les modifications',
    'settings.saving': 'Enregistrement...',
    'settings.profileUpdated': 'Profil mis à jour',
    'settings.updateFailed': 'Échec de la mise à jour du profil',
    'settings.subscription': 'Abonnement',
    'settings.freePlan': 'Plan gratuit',
    'settings.proPlan': 'Plan Pro',
    'settings.upgradeToPro': 'Passer au Pro',
  },

  de: {
    // Auth
    'auth.signIn': 'Anmelden',
    'auth.signUp': 'Konto erstellen',
    'auth.continueWithGoogle': 'Weiter mit Google',
    'auth.or': 'ODER',
    'auth.email': 'E-Mail',
    'auth.password': 'Passwort',
    'auth.emailPlaceholder': 'du@beispiel.com',
    'auth.passwordPlaceholder': 'Dein Passwort',
    'auth.minChars': 'Mind. 6 Zeichen',
    'auth.signingIn': 'Anmeldung läuft...',
    'auth.creatingAccount': 'Konto wird erstellt...',
    'auth.noAccount': 'Noch kein Konto?',
    'auth.hasAccount': 'Bereits ein Konto?',
    'auth.checkEmail': 'Überprüfe deine E-Mail, um dein Konto zu bestätigen',
    'auth.signInFailed': 'Anmeldung fehlgeschlagen. Bitte versuche es erneut.',
    'auth.signUpFailed': 'Kontoerstellung fehlgeschlagen. Bitte versuche es erneut.',

    // Nav
    'nav.translator': 'Übersetzer',
    'nav.dictionary': 'Wörterbuch',

    // Profile
    'profile.user': 'Benutzer',
    'profile.settings': 'Einstellungen',
    'profile.language': 'Sprache',
    'profile.theme': 'Design',
    'profile.light': 'Hell',
    'profile.dark': 'Dunkel',
    'profile.system': 'System',
    'profile.logout': 'Abmelden',

    // Translator
    'translator.inputPlaceholder': 'Text hier eingeben oder einfügen...',
    'translator.outputPlaceholder': 'Übersetzung erscheint hier...',
    'translator.translating': 'Übersetze...',
    'translator.addToDictionary': 'Zum Wörterbuch hinzufügen',
    'translator.characters': 'Zeichen',
    'translator.editText': 'Text bearbeiten',

    // Dictionary
    'dictionary.title': 'Wörterbuch',
    'dictionary.empty': 'Dein Wörterbuch ist leer',
    'dictionary.search': 'Wörter suchen...',
    'dictionary.added': 'zum Wörterbuch hinzugefügt',
    'dictionary.deleted': 'Wort gelöscht',
    'dictionary.failedAdd': 'Wort konnte nicht hinzugefügt werden',

    // Settings
    'settings.title': 'Einstellungen',
    'settings.profile': 'Profil',
    'settings.fullName': 'Vollständiger Name',
    'settings.saveChanges': 'Änderungen speichern',
    'settings.saving': 'Speichern...',
    'settings.profileUpdated': 'Profil aktualisiert',
    'settings.updateFailed': 'Profil konnte nicht aktualisiert werden',
    'settings.subscription': 'Abonnement',
    'settings.freePlan': 'Kostenloser Plan',
    'settings.proPlan': 'Pro-Plan',
    'settings.upgradeToPro': 'Auf Pro upgraden',
  },
}

export { translations }

export function t(locale: Locale, key: string): string {
  return translations[locale]?.[key] || translations.en[key] || key
}
