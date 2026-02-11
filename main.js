import { IfcViewerAPI } from 'web-ifc-viewer';

const container = document.getElementById('app');
window.viewer = new IfcViewerAPI({ 
    container, 
    backgroundColor: {r: 220, g: 220, b: 220} 
});

window.viewer.grid.setGrid();
window.viewer.axes.setAxes();

// ✨ 修正重點：改用 CDN 載入 WASM 引擎，這能 100% 解決 Worker 報錯問題
window.viewer.IFC.setWasmPath('https://unpkg.com/web-ifc@0.0.36/'); 

async function loadAndCenterModel() {
    console.log("🚀 引擎初始化中...");
    try {
        // 加上隨機數標籤防止快取
        const modelUrl = `/model.ifc?t=${new Date().getTime()}`;
        const model = await window.viewer.IFC.loadIfcUrl(modelUrl);
        
        // 強制座標歸零
        model.position.set(0, 0, 0);
        
        // 自動對焦
        setTimeout(async () => {
            await window.viewer.context.ifcCamera.activeCamera.controls.fitToBox(model, true);
            window.viewer.shadowDropper.renderShadow(model.modelID);
            console.log("🎉 模型已成功顯現！");
        }, 1000);
        
    } catch (error) {
        console.error("❌ 載入失敗：", error);
    }
}

loadAndCenterModel();