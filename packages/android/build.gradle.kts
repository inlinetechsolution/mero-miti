plugins {
    alias(libs.plugins.android.library) apply false
    kotlin("android") version "1.9.22"
}

// Android Library Configuration for Mero Miti
// Note: When integrated in an Android project, include in settings.gradle:
// include(":mero-miti-android")
// project(":mero-miti-android").projectDir = file("path/to/mero-miti/packages/android")
