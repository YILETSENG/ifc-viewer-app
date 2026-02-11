import { IfcViewerAPI } from 'web-ifc-viewer';

const container = document.getElementById('app');
// 1. 建立全域變數
window.viewer = new IfcViewerAPI({ 
    container, 
    backgroundColor: {r: 220, g: 220, b: 220} 
});

window.viewer.grid.setGrid();
window.viewer.axes.setAxes();
window.viewer.IFC.setWasmPath('/'); 

async function loadAndCenterModel() {
    console.log("🚀 正在努力載入模型，請稍候...");
    try {
        // 2. 載入模型 (加上隨機標籤防止快取)
        const model = await window.viewer.IFC.loadIfcUrl(`/model.ifc?t=${new Date().getTime()}`);
        
        // 3. ✨ 強制歸零並自動對焦
        model.position.set(0, 0, 0);
        
        // 給引擎一點點渲染時間 (500ms)
        setTimeout(async () => {
            await window.viewer.context.ifcCamera.activeCamera.controls.fitToBox(model, true);
            window.viewer.shadowDropper.renderShadow(model.modelID);
            console.log("🎉 大功告成！模型已自動對焦。");
        }, 500);
        
    } catch (error) {
        console.error("❌ 載入失敗：", error);
    }
}

loadAndCenterModel();