import { IfcViewerAPI } from 'web-ifc-viewer';

const container = document.getElementById('app');
const viewer = new IfcViewerAPI({ 
    container, 
    // 背景改為灰色，方便看清建築模型
    backgroundColor: {r: 220, g: 220, b: 220} 
});

// 1. 基本設置
viewer.grid.setGrid();
viewer.axes.setAxes();

// 2. ✨ 核心修正：強制指向根目錄載入 WASM
// 這會解決之前遇到的 'worker sent an error' 錯誤
viewer.IFC.setWasmPath('/'); 

async function loadAndCenterModel() {
    try {
        console.log("正在從 public 載入 model.ifc...");
        
        // 3. ✨ 載入模型 (路徑加上斜線，確保對接到伺服器根目錄)
        const model = await viewer.IFC.loadIfcUrl('/model.ifc');
        
        // 4. ✨ 自動對焦：將相機移動到模型正前方
        await viewer.context.ifcCamera.activeCamera.controls.fitToBox(model, true);
        
        // 5. 渲染陰影
        viewer.shadowDropper.renderShadow(model.modelID);
        
        console.log("🎉 恭喜！模型已成功載入並置中！");
        
    } catch (error) {
        console.error("載入失敗：", error);
    }
}

loadAndCenterModel();

// 6. 選取構件功能
window.onpointerdown = async () => {
    const result = await viewer.IFC.selector.pickIfcItem(true);
    if (!result) return;
    const { modelID, id } = result;
    const props = await viewer.IFC.getProperties(modelID, id, true, false);
    console.log("選取構件屬性：", props);
};