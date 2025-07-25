use tauri::Manager;

use tauri_plugin_decorum::WebviewWindowExt; // adds helper methods to WebviewWindow

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_decorum::init()) // initialize the decorum plugin
    .setup(|app| {
        // Create a custom titlebar for main window
        // On Windows this will hide decoration and render custom window controls
        // On macOS it expects a hiddenTitle: true and titleBarStyle: overlay
        let main_window = app.get_webview_window("main").unwrap();
        main_window.create_overlay_titlebar().unwrap();

        #[cfg(target_os = "macos")]
        main_window.set_traffic_lights_inset(16.0, 20.0).unwrap();
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
