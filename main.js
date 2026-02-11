import { IfcViewerAPI } from 'web-ifc-viewer';

const container = document.getElementById('app');
const viewer = new IfcViewerAPI({ 
    container, 
    // 背景改為淺灰色，讓模型與網格更清晰
    backgroundColor: {r: 220, g: 220, b: 220} 
});

// 1. 基本設置
viewer.grid.setGrid();
viewer.axes.setAxes();

// 2. ✨ 核心修正：強制指向根目錄的 WASM 檔案
// 這會解決妳看到的 'worker sent an error' 錯誤
viewer.IFC.setWasmPath('/'); 

async function loadAndCenterModel() {
    try {
        console.log("正在從伺服器抓取 model.ifc...");
        
        // 3. ✨ 載入模型 (路徑加上斜線，確保對接到 public 資料夾)
        const model = await viewer.IFC.loadIfcUrl('/model.ifc');
        
        // 4. ✨ 自動對焦：將相機拉到模型面前
        // 這會解決妳「畫面沒東西」的問題
        await viewer.context.ifcCamera.activeCamera.controls.fitToBox(model, true);
        
        // 5. 渲染陰影
        viewer.shadowDropper.renderShadow(model.modelID);
        
        console.log("🎉 恭喜！模型加載成功！");
        
    } catch (error) {
        console.error("載入失敗，請按 F12 檢查 Network 標籤：", error);
    }
}

// 執行加載流程
loadAndCenterModel();

// 6. 點擊功能：選取構件並顯示屬性
window.onpointerdown = async () => {
    const result = await viewer.IFC.selector.pickIfcItem(true);
    if (!result) return;
    
    const { modelID, id } = result;
    const props = await viewer.IFC.getProperties(modelID, id, true, false);
    console.log("您選取的構件屬性為：", props);
};