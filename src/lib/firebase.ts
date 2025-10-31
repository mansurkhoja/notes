import { getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

let app: FirebaseApp
let auth: Auth
let googleProvider: GoogleAuthProvider

export function getFirebaseApp(): FirebaseApp {
	if (!app) {
		const config = {
			apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
			authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
			projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
			storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
			messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
			appId: import.meta.env.VITE_FIREBASE_APP_ID,
		}
		if (
			!config.apiKey ||
			!config.authDomain ||
			!config.projectId ||
			!config.appId
		) {
			throw new Error(
				'Missing Firebase env vars. See README for VITE_FIREBASE_* variables.'
			)
		}
		app = getApps().length ? getApps()[0]! : initializeApp(config)
	}
	return app
}

export function getFirebaseAuth(): Auth {
	if (!auth) {
		auth = getAuth(getFirebaseApp())
	}
	return auth
}

export function getGoogleProvider(): GoogleAuthProvider {
	if (!googleProvider) {
		googleProvider = new GoogleAuthProvider()
		googleProvider.setCustomParameters({ prompt: 'select_account' })
	}
	return googleProvider
}

export const db = getFirestore(getFirebaseApp())
