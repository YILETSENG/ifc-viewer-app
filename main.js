import { IfcViewerAPI } from 'web-ifc-viewer';

const container = document.getElementById('app');
const viewer = new IfcViewerAPI({ 
    container, 
    backgroundColor: {r: 220, g: 220, b: 220} 
});

viewer.grid.setGrid();
viewer.axes.setAxes();

// 指向根目錄
viewer.IFC.setWasmPath('/'); 

async function loadAndCenterModel() {
    console.log("🚀 引擎準備就緒，3秒後開始抓取模型...");
    
    // 加一個 3 秒的緩衝，確保 Vercel 環境完全加載
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
        // 使用絕對路徑
        const model = await viewer.IFC.loadIfcUrl('/model.ifc');
        
        console.log("✅ 模型物件已成功獲取！");
        
        // 強制相機對焦
        await viewer.context.ifcCamera.activeCamera.controls.fitToBox(model, true);
        viewer.shadowDropper.renderShadow(model.modelID);
        
        console.log("🎉 模型應該出現在螢幕中央了！");
        
    } catch (error) {
        console.error("❌ 載入失敗原因：", error);
    }
}

loadAndCenterModel();

window.onpointerdown = async () => {
    const result = await viewer.IFC.selector.pickIfcItem(true);
    if (result) {
        const props = await viewer.IFC.getProperties(result.modelID, result.id, true, false);
        console.log("構件屬性：", props);
    }
};