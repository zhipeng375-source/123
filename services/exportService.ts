import { Project, Opportunity } from '../types';

/**
 * Helper to download text content as a file
 */
const downloadFile = (content: string, fileName: string, mimeType: string) => {
  // Add BOM (\ufeff) to ensure Excel opens UTF-8 encoded files correctly with Chinese characters
  const blob = new Blob(["\ufeff" + content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportProjectsToCSV = (projects: Project[]) => {
  if (!projects || projects.length === 0) {
    alert("暂无数据可导出");
    return;
  }

  const headers = ['项目名称', '客户名称', '地点', '预算(万)', '状态', '启动日期', '技术参数', '描述'];
  
  const csvRows = projects.map(p => {
    // Escape quotes and handle commas in fields
    const safe = (str: string | number | undefined) => `"${String(str || '').replace(/"/g, '""')}"`;
    
    return [
      safe(p.name),
      safe(p.clientName),
      safe(p.location),
      safe(p.budget),
      safe(p.status),
      safe(p.startDate),
      safe(p.technicalSpecs),
      safe(p.description)
    ].join(',');
  });

  const csvContent = [headers.join(','), ...csvRows].join('\n');
  downloadFile(csvContent, `双良项目列表_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv;charset=utf-8;');
};

export const exportOpportunitiesToCSV = (opportunities: Opportunity[]) => {
  if (!opportunities || opportunities.length === 0) {
    alert("暂无数据可导出");
    return;
  }

  const headers = ['商机名称', '客户名称', '联系人', '联系电话', '预计金额(万)', '阶段', '赢率(%)', '预计签约日期', '负责人', '需求描述'];
  
  const csvRows = opportunities.map(o => {
    const safe = (str: string | number | undefined) => `"${String(str || '').replace(/"/g, '""')}"`;
    
    return [
      safe(o.projectName),
      safe(o.clientName),
      safe(o.contactPerson),
      safe(o.phone),
      safe(o.expectedValue),
      safe(o.stage),
      safe(o.probability),
      safe(o.expectedSigningDate),
      safe(o.owner),
      safe(o.description)
    ].join(',');
  });

  const csvContent = [headers.join(','), ...csvRows].join('\n');
  downloadFile(csvContent, `双良商机报表_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv;charset=utf-8;');
};
