function mainBeforeAddingSectionTEST() {
  logQuestionsInSections1And2();
}

function logQuestionsInSections1And2() {
  try {
    console.log("スクリプトの実行を開始しました。", new Date());
    
    // スクリプトプロパティからフォルダIDを取得
    const scriptProperties = PropertiesService.getScriptProperties();
    const folderId = scriptProperties.getProperty("FOLDER_ID");
    if (!folderId) {
      throw new Error("フォルダIDが設定されていません。スクリプトプロパティに 'FOLDER_ID' を設定してください。");
    }
    
    // 指定したフォルダを取得
    const folder = DriveApp.getFolderById(folderId);
    const files = folder.getFilesByType(MimeType.GOOGLE_FORMS);
    
    let formCount = 0;
    let allSectionsValid = true;
    const invalidFormIds = [];
    while (files.hasNext()) {
      formCount++;
      const file = files.next();
      const formId = file.getId();
      try {
        console.log(`Form ID '${formId}' の処理を開始します。`, new Date());
        const form = FormApp.openById(formId);
        const formTitle = form.getTitle();
        console.log(`Form '${formTitle}' のタイトルを取得しました。`, new Date());

        // フォームのセクションタイトルを取得
        const items = form.getItems();
        const sectionTitles = [];
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.getType() === FormApp.ItemType.PAGE_BREAK) {
            sectionTitles.push(item.asPageBreakItem().getTitle());
          }
        }

        // セクションタイトルをログ出力
        console.log(`Form '${formTitle}' のセクションタイトル: ${sectionTitles.join(", ")}`, new Date());

        // セクション1のタイトルが "代替貸出" であるかを確認
        if (sectionTitles.length >= 1 && sectionTitles[0] === "代替貸出") {
          console.log(`Form '${formTitle}' のセクション1のタイトルは '代替貸出' です。`, new Date());
        } else {
          console.log(`Form '${formTitle}' のセクション1のタイトルが '代替貸出' ではありません。`, new Date());
          allSectionsValid = false;
          invalidFormIds.push(formId);
        }
      } catch (e) {
        console.log(`Form ID '${formId}' の処理中にエラーが発生しました: ${e}`, new Date());
        allSectionsValid = false;
        invalidFormIds.push(formId);
      }
    }
    console.log(`対象のフォーム数: ${formCount}`, new Date());
    if (allSectionsValid) {
      console.log("全てのフォームのセクション1のタイトルは '代替貸出' です。OK。", new Date());
    } else {
      console.log("いくつかのフォームのセクション1のタイトルが '代替貸出' ではありません。", new Date());
      console.log(`代替貸出ではなかったフォームのID: ${invalidFormIds.join(", ")}`, new Date());
    }
    console.log("スクリプトの実行を終了しました。", new Date());
  } catch (e) {
    console.log(`スクリプト全体でエラーが発生しました: ${e}`, new Date());
  }
}
