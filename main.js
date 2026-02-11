// 修改引用方式，確保 Vite 能正確處理 Worker
import { IfcViewerAPI } from 'web-ifc-viewer';

const container = document.getElementById('app');
// 將 viewer 掛載到 window 方便妳除錯
window.viewer = new IfcViewerAPI({ 
    container, 
    backgroundColor: {r: 220, g: 220, b: 220} 
});

window.viewer.grid.setGrid();
window.viewer.axes.setAxes();

// ✨ 關鍵修正：確保 WASM 與 Worker 路徑絕對正確
window.viewer.IFC.setWasmPath('/'); 

async function loadAndCenterModel() {
    try {
        console.log("🚀 引擎啟動中，正在載入模型...");
        
        // 加上隨機數標籤強迫重新整理
        const model = await window.viewer.IFC.loadIfcUrl(`/model.ifc?t=${new Date().getTime()}`);
        
        // 強制歸零
        model.position.set(0, 0, 0);
        
        // 自動對焦
        setTimeout(async () => {
            await window.viewer.context.ifcCamera.activeCamera.controls.fitToBox(model, true);
            window.viewer.shadowDropper.renderShadow(model.modelID);
            console.log("🎉 成功！模型已顯示。");
        }, 800);
        
    } catch (error) {
        // 如果失敗，這裡會印出具體原因
        console.error("❌ 載入過程中斷：", error);
    }
}

loadAndCenterModel();