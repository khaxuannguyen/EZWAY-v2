export const markets = [{code:'US',name:'Mỹ'},{code:'CA',name:'Canada'},{code:'AU',name:'Úc'},{code:'NZ',name:'New Zealand'},{code:'GB',name:'Anh'},{code:'EU',name:'Châu Âu'}] as const;
// All current EU member destinations confirmed by the owner on 2026-10-12.
export const euCountries = [{code:'AT',name:'Áo'},{code:'BE',name:'Bỉ'},{code:'BG',name:'Bulgaria'},{code:'HR',name:'Croatia'},{code:'CY',name:'Síp'},{code:'CZ',name:'Séc'},{code:'DK',name:'Đan Mạch'},{code:'EE',name:'Estonia'},{code:'FI',name:'Phần Lan'},{code:'FR',name:'Pháp'},{code:'DE',name:'Đức'},{code:'GR',name:'Hy Lạp'},{code:'HU',name:'Hungary'},{code:'IE',name:'Ireland'},{code:'IT',name:'Ý'},{code:'LV',name:'Latvia'},{code:'LT',name:'Lithuania'},{code:'LU',name:'Luxembourg'},{code:'MT',name:'Malta'},{code:'NL',name:'Hà Lan'},{code:'PL',name:'Ba Lan'},{code:'PT',name:'Bồ Đào Nha'},{code:'RO',name:'Romania'},{code:'SK',name:'Slovakia'},{code:'SI',name:'Slovenia'},{code:'ES',name:'Tây Ban Nha'},{code:'SE',name:'Thụy Điển'}] as const;
export const cargoCategories = ['Thực phẩm khô','Quần áo','Mỹ phẩm','Đồ dùng cá nhân','Hàng điện tử','Hàng đông lạnh','Hàng cồng kềnh','Loại hàng khác'] as const;
export const routeGuidance:Record<string,string> = {
  US:'City hoặc ZIP code giúp kiểm tra chặng giao. Thực phẩm, mỹ phẩm, thuốc và pin cần đối chiếu riêng trước khi nhận.',
  CA:'City hoặc postal code giúp kiểm tra điểm nhận. Cần mô tả rõ thành phần, công dụng và tình trạng hàng.',
  AU:'Thực phẩm, đồ có nguồn gốc động thực vật và hàng đặc biệt cần kiểm tra điều kiện tiếp nhận riêng.',
  NZ:'Mô tả rõ thành phần và tình trạng hàng; nhóm thực phẩm, động thực vật và hàng đặc biệt cần kiểm tra riêng.',
  GB:'City hoặc postcode giúp kiểm tra chặng giao. EZWAY sẽ đối chiếu loại hàng và yêu cầu khai báo theo lô hàng.',
  EU:'Chọn nước đến cụ thể. Điều kiện tiếp nhận, khai báo và chặng giao được kiểm tra riêng theo từng quốc gia.',
};
export function destinationName(code:string){return [...markets,...euCountries].find(c=>c.code===code)?.name||code;}
