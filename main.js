import { IfcViewerAPI } from 'web-ifc-viewer';

const container = document.getElementById('app');
const viewer = new IfcViewerAPI({ 
    container, 
    // 建議背景改成稍微灰一點點，白色有時候會讓白色建築模型看不清楚
    backgroundColor: {r: 220, g: 220, b: 220} 
});

// 1. 基本設置
viewer.grid.setGrid();
viewer.axes.setAxes();

// ✨ 修正 1：路徑確保是絕對路徑 '/'
// 這會告訴網頁去 https://妳的網址.vercel.app/ 抓 wasm 檔案
viewer.IFC.setWasmPath('/'); 

async function loadAndCenterModel() {
    try {
        console.log("正在載入模型並計算中心位置...");
        
        // ✨ 修正 2：移除檔名前面的點點 '.'
        // 在 Vercel 上，直接寫 'model.ifc' 會比 './model.ifc' 更保險
        const model = await viewer.IFC.loadIfcUrl('model.ifc');
        
        // 3. 自動對焦與置中
        viewer.context.ifcCamera.activeCamera.controls.fitToBox(model, true);
        
        // 4. 加強視覺效果
        viewer.shadowDropper.renderShadow(model.modelID);
        
        console.log("🎉 模型已完美置中！");
        
    } catch (error) {
        // 如果還是出錯，這裡會印出具體原因
        console.error("載入失敗，詳細原因：", error);
    }
}

loadAndCenterModel();

window.onpointerdown = async () => {
    const result = await viewer.IFC.selector.pickIfcItem(true);
    if (!result) return;
    
    const { modelID, id } = result;
    const props = await viewer.IFC.getProperties(modelID, id, true, false);
    console.log("您選取的構件屬性為：", props);
};