export type Locale = 'uk' | 'en' | 'ru' | 'es' | 'fr' | 'it'

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
    'translator.langDetected': 'Language detected',
    'translator.analyzing': 'Analyzing grammar...',
    'translator.used': 'Used',
    'translator.limitReached': 'Character limit reached. Upgrade to Pro!',

    // Parts of speech
    'pos.noun': 'noun',
    'pos.adjective': 'adjective',
    'pos.verb': 'verb',
    'pos.adverb': 'adverb',
    'pos.pronoun': 'pronoun',
    'pos.numeral': 'numeral',
    'pos.preposition': 'preposition',
    'pos.conjunction': 'conjunction',
    'pos.particle': 'particle',
    'pos.interjection': 'interjection',
    'pos.participle': 'participle',
    'pos.gerund': 'gerund',

    // Tooltip
    'tooltip.pos': 'part of speech',
    'tooltip.definition': 'definition',
    'tooltip.example': 'example',

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

    // Language names (for translator selectors)
    'lang.uk': 'Ukrainian',
    'lang.en': 'English',
    'lang.ru': 'Russian',
    'lang.it': 'Italian',
    'lang.es': 'Spanish',
    'lang.fr': 'French',
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
    'translator.langDetected': 'Мову визначено',
    'translator.analyzing': 'Аналізуємо граматику...',
    'translator.used': 'Використано',
    'translator.limitReached': 'Ліміт символів вичерпано. Перейдіть на Pro!',

    // Parts of speech
    'pos.noun': 'іменник',
    'pos.adjective': 'прикметник',
    'pos.verb': 'дієслово',
    'pos.adverb': 'прислівник',
    'pos.pronoun': 'займенник',
    'pos.numeral': 'числівник',
    'pos.preposition': 'прийменник',
    'pos.conjunction': 'сполучник',
    'pos.particle': 'частка',
    'pos.interjection': 'вигук',
    'pos.participle': 'дієприкметник',
    'pos.gerund': 'дієприслівник',

    // Tooltip
    'tooltip.pos': 'частина мови',
    'tooltip.definition': 'визначення',
    'tooltip.example': 'приклад',

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

    // Language names
    'lang.uk': 'Українська',
    'lang.en': 'Англійська',
    'lang.ru': 'Російська',
    'lang.it': 'Італійська',
    'lang.es': 'Іспанська',
    'lang.fr': 'Французька',
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
    'translator.langDetected': 'Язык определён',
    'translator.analyzing': 'Анализируем грамматику...',
    'translator.used': 'Использовано',
    'translator.limitReached': 'Лимит символов исчерпан. Перейдите на Pro!',

    // Parts of speech
    'pos.noun': 'существительное',
    'pos.adjective': 'прилагательное',
    'pos.verb': 'глагол',
    'pos.adverb': 'наречие',
    'pos.pronoun': 'местоимение',
    'pos.numeral': 'числительное',
    'pos.preposition': 'предлог',
    'pos.conjunction': 'союз',
    'pos.particle': 'частица',
    'pos.interjection': 'междометие',
    'pos.participle': 'причастие',
    'pos.gerund': 'деепричастие',

    // Tooltip
    'tooltip.pos': 'часть речи',
    'tooltip.definition': 'определение',
    'tooltip.example': 'пример',

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

    // Language names
    'lang.uk': 'Украинский',
    'lang.en': 'Английский',
    'lang.ru': 'Русский',
    'lang.it': 'Итальянский',
    'lang.es': 'Испанский',
    'lang.fr': 'Французский',
  },

  it: {
    // Auth
    'auth.signIn': 'Accedi',
    'auth.signUp': 'Crea account',
    'auth.continueWithGoogle': 'Continua con Google',
    'auth.or': 'O',
    'auth.email': 'E-mail',
    'auth.password': 'Password',
    'auth.emailPlaceholder': 'tu@esempio.com',
    'auth.passwordPlaceholder': 'La tua password',
    'auth.minChars': 'Min. 6 caratteri',
    'auth.signingIn': 'Accesso in corso...',
    'auth.creatingAccount': 'Creazione account...',
    'auth.noAccount': 'Non hai un account?',
    'auth.hasAccount': 'Hai gi\u00E0 un account?',
    'auth.checkEmail': 'Controlla la tua email per confermare l\'account',
    'auth.signInFailed': 'Accesso non riuscito. Riprova.',
    'auth.signUpFailed': 'Creazione account non riuscita. Riprova.',

    // Nav
    'nav.translator': 'Traduttore',
    'nav.dictionary': 'Dizionario',

    // Profile
    'profile.user': 'Utente',
    'profile.settings': 'Impostazioni',
    'profile.language': 'Lingua',
    'profile.theme': 'Tema',
    'profile.light': 'Chiaro',
    'profile.dark': 'Scuro',
    'profile.system': 'Sistema',
    'profile.logout': 'Esci',

    // Translator
    'translator.inputPlaceholder': 'Scrivi o incolla il testo qui...',
    'translator.outputPlaceholder': 'La traduzione apparir\u00E0 qui...',
    'translator.translating': 'Traduzione in corso...',
    'translator.addToDictionary': 'Aggiungi al dizionario',
    'translator.characters': 'caratteri',
    'translator.editText': 'Modifica testo',
    'translator.langDetected': 'Lingua rilevata',
    'translator.analyzing': 'Analisi grammaticale...',
    'translator.used': 'Usati',
    'translator.limitReached': 'Limite caratteri raggiunto. Passa a Pro!',

    // Parts of speech
    'pos.noun': 'sostantivo',
    'pos.adjective': 'aggettivo',
    'pos.verb': 'verbo',
    'pos.adverb': 'avverbio',
    'pos.pronoun': 'pronome',
    'pos.numeral': 'numerale',
    'pos.preposition': 'preposizione',
    'pos.conjunction': 'congiunzione',
    'pos.particle': 'particella',
    'pos.interjection': 'interiezione',
    'pos.participle': 'participio',
    'pos.gerund': 'gerundio',

    // Tooltip
    'tooltip.pos': 'parte del discorso',
    'tooltip.definition': 'definizione',
    'tooltip.example': 'esempio',

    // Dictionary
    'dictionary.title': 'Dizionario',
    'dictionary.empty': 'Il tuo dizionario \u00E8 vuoto',
    'dictionary.search': 'Cerca parole...',
    'dictionary.added': 'aggiunto al dizionario',
    'dictionary.deleted': 'Parola eliminata',
    'dictionary.failedAdd': 'Impossibile aggiungere la parola',

    // Settings
    'settings.title': 'Impostazioni',
    'settings.profile': 'Profilo',
    'settings.fullName': 'Nome completo',
    'settings.saveChanges': 'Salva modifiche',
    'settings.saving': 'Salvataggio...',
    'settings.profileUpdated': 'Profilo aggiornato',
    'settings.updateFailed': 'Aggiornamento profilo non riuscito',
    'settings.subscription': 'Abbonamento',
    'settings.freePlan': 'Piano gratuito',
    'settings.proPlan': 'Piano Pro',
    'settings.upgradeToPro': 'Passa a Pro',

    // Language names
    'lang.uk': 'Ucraino',
    'lang.en': 'Inglese',
    'lang.ru': 'Russo',
    'lang.it': 'Italiano',
    'lang.es': 'Spagnolo',
    'lang.fr': 'Francese',
  },

  es: {
    // Auth
    'auth.signIn': 'Iniciar sesi\u00F3n',
    'auth.signUp': 'Crear cuenta',
    'auth.continueWithGoogle': 'Continuar con Google',
    'auth.or': 'O',
    'auth.email': 'Correo electr\u00F3nico',
    'auth.password': 'Contrase\u00F1a',
    'auth.emailPlaceholder': 'tu@ejemplo.com',
    'auth.passwordPlaceholder': 'Tu contrase\u00F1a',
    'auth.minChars': 'M\u00EDn. 6 caracteres',
    'auth.signingIn': 'Iniciando sesi\u00F3n...',
    'auth.creatingAccount': 'Creando cuenta...',
    'auth.noAccount': '\u00BFNo tienes cuenta?',
    'auth.hasAccount': '\u00BFYa tienes cuenta?',
    'auth.checkEmail': 'Revisa tu correo electr\u00F3nico para confirmar tu cuenta',
    'auth.signInFailed': 'Error al iniciar sesi\u00F3n. Int\u00E9ntalo de nuevo.',
    'auth.signUpFailed': 'Error al crear la cuenta. Int\u00E9ntalo de nuevo.',

    // Nav
    'nav.translator': 'Traductor',
    'nav.dictionary': 'Diccionario',

    // Profile
    'profile.user': 'Usuario',
    'profile.settings': 'Configuraci\u00F3n',
    'profile.language': 'Idioma',
    'profile.theme': 'Tema',
    'profile.light': 'Claro',
    'profile.dark': 'Oscuro',
    'profile.system': 'Sistema',
    'profile.logout': 'Cerrar sesi\u00F3n',

    // Translator
    'translator.inputPlaceholder': 'Escribe o pega texto aqu\u00ED...',
    'translator.outputPlaceholder': 'La traducci\u00F3n aparecer\u00E1 aqu\u00ED...',
    'translator.translating': 'Traduciendo...',
    'translator.addToDictionary': 'A\u00F1adir al diccionario',
    'translator.characters': 'caracteres',
    'translator.editText': 'Editar texto',
    'translator.langDetected': 'Idioma detectado',
    'translator.analyzing': 'Analizando gram\u00E1tica...',
    'translator.used': 'Usado',
    'translator.limitReached': 'L\u00EDmite de caracteres alcanzado. \u00A1Pasa a Pro!',

    // Parts of speech
    'pos.noun': 'sustantivo',
    'pos.adjective': 'adjetivo',
    'pos.verb': 'verbo',
    'pos.adverb': 'adverbio',
    'pos.pronoun': 'pronombre',
    'pos.numeral': 'numeral',
    'pos.preposition': 'preposici\u00F3n',
    'pos.conjunction': 'conjunci\u00F3n',
    'pos.particle': 'part\u00EDcula',
    'pos.interjection': 'interjecci\u00F3n',
    'pos.participle': 'participio',
    'pos.gerund': 'gerundio',

    // Tooltip
    'tooltip.pos': 'parte de la oraci\u00F3n',
    'tooltip.definition': 'definici\u00F3n',
    'tooltip.example': 'ejemplo',

    // Dictionary
    'dictionary.title': 'Diccionario',
    'dictionary.empty': 'Tu diccionario est\u00E1 vac\u00EDo',
    'dictionary.search': 'Buscar palabras...',
    'dictionary.added': 'a\u00F1adido al diccionario',
    'dictionary.deleted': 'Palabra eliminada',
    'dictionary.failedAdd': 'Error al a\u00F1adir la palabra',

    // Settings
    'settings.title': 'Configuraci\u00F3n',
    'settings.profile': 'Perfil',
    'settings.fullName': 'Nombre completo',
    'settings.saveChanges': 'Guardar cambios',
    'settings.saving': 'Guardando...',
    'settings.profileUpdated': 'Perfil actualizado',
    'settings.updateFailed': 'Error al actualizar el perfil',
    'settings.subscription': 'Suscripci\u00F3n',
    'settings.freePlan': 'Plan gratuito',
    'settings.proPlan': 'Plan Pro',
    'settings.upgradeToPro': 'Actualizar a Pro',

    // Language names
    'lang.uk': 'Ucraniano',
    'lang.en': 'Ingl\u00E9s',
    'lang.ru': 'Ruso',
    'lang.it': 'Italiano',
    'lang.es': 'Espa\u00F1ol',
    'lang.fr': 'Franc\u00E9s',
  },

  fr: {
    // Auth
    'auth.signIn': 'Se connecter',
    'auth.signUp': 'Cr\u00E9er un compte',
    'auth.continueWithGoogle': 'Continuer avec Google',
    'auth.or': 'OU',
    'auth.email': 'E-mail',
    'auth.password': 'Mot de passe',
    'auth.emailPlaceholder': 'vous@exemple.com',
    'auth.passwordPlaceholder': 'Votre mot de passe',
    'auth.minChars': 'Min. 6 caract\u00E8res',
    'auth.signingIn': 'Connexion en cours...',
    'auth.creatingAccount': 'Cr\u00E9ation du compte...',
    'auth.noAccount': "Vous n'avez pas de compte ?",
    'auth.hasAccount': 'Vous avez d\u00E9j\u00E0 un compte ?',
    'auth.checkEmail': 'V\u00E9rifiez votre e-mail pour confirmer votre compte',
    'auth.signInFailed': '\u00C9chec de la connexion. Veuillez r\u00E9essayer.',
    'auth.signUpFailed': '\u00C9chec de la cr\u00E9ation du compte. Veuillez r\u00E9essayer.',

    // Nav
    'nav.translator': 'Traducteur',
    'nav.dictionary': 'Dictionnaire',

    // Profile
    'profile.user': 'Utilisateur',
    'profile.settings': 'Param\u00E8tres',
    'profile.language': 'Langue',
    'profile.theme': 'Th\u00E8me',
    'profile.light': 'Clair',
    'profile.dark': 'Sombre',
    'profile.system': 'Syst\u00E8me',
    'profile.logout': 'Se d\u00E9connecter',

    // Translator
    'translator.inputPlaceholder': 'Saisissez ou collez du texte ici...',
    'translator.outputPlaceholder': 'La traduction appara\u00EEtra ici...',
    'translator.translating': 'Traduction en cours...',
    'translator.addToDictionary': 'Ajouter au dictionnaire',
    'translator.characters': 'caract\u00E8res',
    'translator.editText': 'Modifier le texte',
    'translator.langDetected': 'Langue d\u00E9tect\u00E9e',
    'translator.analyzing': 'Analyse grammaticale...',
    'translator.used': 'Utilis\u00E9s',
    'translator.limitReached': 'Limite de caract\u00E8res atteinte. Passez \u00E0 Pro !',

    // Parts of speech
    'pos.noun': 'nom',
    'pos.adjective': 'adjectif',
    'pos.verb': 'verbe',
    'pos.adverb': 'adverbe',
    'pos.pronoun': 'pronom',
    'pos.numeral': 'num\u00E9ral',
    'pos.preposition': 'pr\u00E9position',
    'pos.conjunction': 'conjonction',
    'pos.particle': 'particule',
    'pos.interjection': 'interjection',
    'pos.participle': 'participe',
    'pos.gerund': 'g\u00E9rondif',

    // Tooltip
    'tooltip.pos': 'partie du discours',
    'tooltip.definition': 'd\u00E9finition',
    'tooltip.example': 'exemple',

    // Dictionary
    'dictionary.title': 'Dictionnaire',
    'dictionary.empty': 'Votre dictionnaire est vide',
    'dictionary.search': 'Rechercher des mots...',
    'dictionary.added': 'ajout\u00E9 au dictionnaire',
    'dictionary.deleted': 'Mot supprim\u00E9',
    'dictionary.failedAdd': "\u00C9chec de l'ajout du mot",

    // Settings
    'settings.title': 'Param\u00E8tres',
    'settings.profile': 'Profil',
    'settings.fullName': 'Nom complet',
    'settings.saveChanges': 'Enregistrer les modifications',
    'settings.saving': 'Enregistrement...',
    'settings.profileUpdated': 'Profil mis \u00E0 jour',
    'settings.updateFailed': '\u00C9chec de la mise \u00E0 jour du profil',
    'settings.subscription': 'Abonnement',
    'settings.freePlan': 'Plan gratuit',
    'settings.proPlan': 'Plan Pro',
    'settings.upgradeToPro': 'Passer au Pro',

    // Language names
    'lang.uk': 'Ukrainien',
    'lang.en': 'Anglais',
    'lang.ru': 'Russe',
    'lang.it': 'Italien',
    'lang.es': 'Espagnol',
    'lang.fr': 'Fran\u00E7ais',
  },
}

export { translations }

export function t(locale: Locale, key: string): string {
  return translations[locale]?.[key] || translations.en[key] || key
}
