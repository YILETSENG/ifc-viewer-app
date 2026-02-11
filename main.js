import { IfcViewerAPI } from 'web-ifc-viewer';

const container = document.getElementById('app');
const viewer = new IfcViewerAPI({ 
    container, 
    backgroundColor: {r: 255, g: 255, b: 255} 
});

// 1. 基本設置
viewer.grid.setGrid();
viewer.axes.setAxes();
viewer.IFC.setWasmPath('/');

async function loadAndCenterModel() {
    try {
        console.log("正在載入模型並計算中心位置...");
        
        // 2. 載入模型
        const model = await viewer.IFC.loadIfcUrl('./model.ifc');
        
        // 3. ✨ 核心動作：自動對焦與置中
        // 這行會計算模型的邊界框 (Bounding Box)，並將相機移動到最適合的距離
        viewer.context.ifcCamera.activeCamera.controls.fitToBox(model, true);
        
        // 4. 加強視覺效果 (陰影)
        viewer.shadowDropper.renderShadow(model.modelID);
        
        console.log("🎉 模型已完美置中！");
        
    } catch (error) {
        console.error("載入失敗：", error);
    }
}

// 執行載入
loadAndCenterModel();

// 5. 點擊功能：選取構件並顯示屬性
window.onpointerdown = async () => {
    const result = await viewer.IFC.selector.pickIfcItem(true);
    if (!result) return;
    
    const { modelID, id } = result;
    const props = await viewer.IFC.getProperties(modelID, id, true, false);
    console.log("您選取的構件屬性為：", props);
};