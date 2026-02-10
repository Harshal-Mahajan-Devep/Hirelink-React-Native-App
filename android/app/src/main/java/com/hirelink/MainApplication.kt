package com.hirelink

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import android.content.Context


class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
        },
    )
  }

 override fun onCreate() {
  super.onCreate()

  // 🔔 Notification Channel (Android 8+)
  if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
    val channel = NotificationChannel(
      "default", // ⚠️ Channel ID
      "Hirelink Notifications",
      NotificationManager.IMPORTANCE_HIGH
    )
    channel.description = "Hirelink app notifications"

    val manager =
      getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    manager.createNotificationChannel(channel)
  }

  loadReactNative(this)
}

}
