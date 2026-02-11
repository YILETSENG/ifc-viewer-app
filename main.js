import { IfcViewerAPI } from 'web-ifc-viewer';

const container = document.getElementById('app');
// ✨ 修改 1：將 viewer 掛載到 window，讓妳可以在 Console 輸入指令
window.viewer = new IfcViewerAPI({ 
    container, 
    backgroundColor: {r: 220, g: 220, b: 220} 
});

window.viewer.grid.setGrid();
window.viewer.axes.setAxes();
window.viewer.IFC.setWasmPath('/'); 

async function loadAndCenterModel() {
    console.log("🚀 準備載入模型...");
    try {
        // ✨ 修改 2：加上隨機數標籤，強迫 Vercel 重新讀取檔案
        const model = await window.viewer.IFC.loadIfcUrl(`/model.ifc?v=${new Date().getTime()}`);
        
        // ✨ 修改 3：強制座標歸零與對焦
        model.position.set(0, 0, 0);
        await window.viewer.context.ifcCamera.activeCamera.controls.fitToBox(model, true);
        window.viewer.shadowDropper.renderShadow(model.modelID);
        
        console.log("🎉 模型載入成功！如果還是沒看到，請在 Console 輸入：viewer.context.ifcCamera.activeCamera.controls.fitToBox(viewer.IFC.loader.ifcManager.state.models[0].mesh, true)");
        
    } catch (error) {
        console.error("❌ 錯誤：", error);
    }
}

loadAndCenterModel();