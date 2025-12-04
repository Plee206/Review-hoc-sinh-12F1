const STORAGE_KEY = 'shopdemo_ratings_v1';

function loadRatings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.warn('Không thể đọc localStorage', e);
    return {};
  }
}

function saveRatings(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Không thể lưu localStorage', e);
  }
}

function calcStats(votes) {
  const entries = Object.values(votes || {});
  if (entries.length === 0) return { avg: 0, count: 0 };
  const sum = entries.reduce((s, v) => s + v, 0);
  return { avg: Math.round((sum / entries.length) * 10) / 10, count: entries.length };
}

const PRODUCTS = [
  { id: 'hs1', img: 'https://scontent.fsgn2-3.fna.fbcdn.net/v/t1.15752-9/420135449_974054527628613_6202293858718409915_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=9f807c&_nc_ohc=VJ0IJYmAhvEQ7kNvwHVoPzE&_nc_oc=Adm_arX4GyuSOvp9x3DmdyTSAnXZuraG2_VbZsjgqIq5CSDHSL6GUxPFNI1qa5YU7-Y&_nc_zt=23&_nc_ht=scontent.fsgn2-3.fna&oh=03_Q7cD4AHRbZkWMTkp0Xpl7rgNP2xUqak8iLSim1N2KPbRx1FGBg&oe=695933CD', title: 'Phạm Nguyễn Minh Thư', desc: 'Minh Thư là một học sinh sở hữu khí chất công chúa quyền lực bậc nhất hệ phổ thông. Từng bước đi của Thư như phát sáng, từng cái liếc mắt như ban thánh chỉ. Nhìn Thư thôi là biết: đây không phải người bình thường, đây là hoàng gia lưu lạc.' },
  { id: 'hs2', img: 'https://scontent.fsgn2-6.fna.fbcdn.net/v/t1.15752-9/535018534_1086046753595766_3249390094079057339_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=9f807c&_nc_ohc=oz1Bbp0TkE8Q7kNvwH5LTE3&_nc_oc=Adk-KpuDkeKXUru1wmTgTDFDYWYBTWj_ovbpJ62FkFdu7VwT_Se25p2OYuu4wiT1QAU&_nc_zt=23&_nc_ht=scontent.fsgn2-6.fna&oh=03_Q7cD4AHFCq42pao-PiV3uRG_dgu7sEbXp75i37EjliRLQMjfwg&oe=69593C59', title: 'Lê Dương Kha', desc: 'Dương Kha là một học sinh siêu thông minh với khả năng ngủ xuyên 8/8 tiết mà điểm vẫn cao như số phận sắp đặt. Cả lớp học còn Kha thì ngủ, nhưng đến lúc kiểm tra, Kha lại làm bài như thể đã ôn cả đêm với Einstein.' },
  { id: 'hs3', img: 'https://scontent.fsgn2-10.fna.fbcdn.net/v/t1.15752-9/594495051_816540888043248_6468825095201241531_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=9f807c&_nc_ohc=yObVb7GG_FUQ7kNvwGP7QXJ&_nc_oc=AdnXjluzQ0run6lfm6qJxYUZy3DLoxxbV5z6tIRU1-ZzD1yASi3lgWUlGKnv1Odtp1o&_nc_zt=23&_nc_ht=scontent.fsgn2-10.fna&oh=03_Q7cD4AH8mmM99ocA0kdyZ87JkLeHEpfilTh9zGPciRYURZYjKA&oe=6959357D', title: 'Nguyễn Thanh Thư', desc: 'Thanh Thư là một học sinh vô cùng phóng khoáng và cởi mở. Không chỉ sở hữu ngoại hình nổi bật, Thư còn có chất giọng Mèn Mén đầy cuốn hút. Có thể xem Thư như một “hiện tượng mới” hứa hẹn sẽ bùng nổ trong năm 2026.' },
  { id: 'hs4', img: 'https://scontent.fsgn2-9.fna.fbcdn.net/v/t1.15752-9/582260768_689701900862295_3188574671947506669_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=9f807c&_nc_ohc=-kWxDjq4PPYQ7kNvwHZpRqc&_nc_oc=AdmvJnhejnK42jtBJGfbrS052E18BHwODbk-1Bo-lqvGTdMhBLuVA83_GF4rbDuuUGo&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&oh=03_Q7cD4AGlcnhNTvSQvm98CAgjC9sfamJhuntw_oA30rXr-A1Ujw&oe=695916C3', title: 'Nguyễn Đình Bình An', desc: 'Bình An là một học sinh mang phong thái rich kid chuẩn chỉnh. Cách Bình An mở cửa, kéo ghế hay bật bút đều toả ra mùi tiền. Nhìn An là hiểu: nếu lớp này là công ty, An chắc chắn là cổ đông lớn nhất dù chưa ký giấy tờ.' },
  { id: 'hs5', img: 'https://scontent.fsgn2-9.fna.fbcdn.net/v/t1.15752-9/541199954_1065921149039946_6330659223859634849_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=9f807c&_nc_ohc=4gL1hT2fiiUQ7kNvwHtAe4I&_nc_oc=Admp8LHYGw3Ii1FcLUi6aN5LCPzslH8NYek2sN_swmz-PR6PZyV2au9QyAgny3R22iA&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&oh=03_Q7cD4AHamgxMJD5KCpb50-aRtSon9RDYh5AJIwquoqiXmwcT3Q&oe=6959243C', title: 'Võ Lê Tấn Phát', desc: 'Tấn Phát là một học sinh được mệnh danh là thánh căn tin của trường. Phát thuộc lòng mọi combo mì – trà tắc – xúc xích, biết giờ nào cô bán hàng vui tính nhất, và đặc biệt là luôn xuất hiện ở căn tin trước cả chuông ra chơi. Không chỉ vậy, Phát còn sở hữu bộ não robotic, xử lý bài tập nhanh như AI đời mới, khiến nhiều người nghi ngờ bạn ấy sạc pin thay vì ngủ.' },
  { id: 'hs6', img: 'https://scontent.fsgn2-3.fna.fbcdn.net/v/t1.15752-9/541122802_1186153483356142_7503160499009616142_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=9f807c&_nc_ohc=fNAQPeMbKQ8Q7kNvwGXfGn-&_nc_oc=AdnKMEWqfCKoPys9J3OT_KcRJiIkrjsPurV0lPLER72GJGx7O5u732_0g2_th77VU14&_nc_zt=23&_nc_ht=scontent.fsgn2-3.fna&oh=03_Q7cD4AHBlmgIM7RSJ_vgp3IVTgw4U_UDtDy7ytcDP6OmjQGKrw&oe=69593460', title: 'Nguyễn Phương Nam', desc: 'Phương Nam là một học sinh mang năng lượng mềm mại và bay bổng, như một dải cầu vồng biết di chuyển. Nam nói chuyện uyển chuyển, đi đứng mượt mà, khiến ai tiếp xúc cũng thấy ừm… hơi “dịu dàng một cách đáng nghi”.' },
  { id: 'hs7', img: 'https://scontent.fsgn2-5.fna.fbcdn.net/v/t1.15752-9/589579427_1813730709348870_8520046504141177649_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=0024fc&_nc_ohc=6bRJcdDuEAYQ7kNvwExuOk6&_nc_oc=Adk7q3by3sNE4Wgv5i46eRgDTjdE5yyENp1Ecv3brGfSzgjIVpT1fNzJvfEXEiRBW08&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.fsgn2-5.fna&oh=03_Q7cD4AGVYrCEGJfjSSdSTQslnFOuLcaXtgIyh726RrzPehqKPQ&oe=695942B1', title: 'Hà Tiểu Cường', desc: 'Hà Tiểu Cường là một học sinh hiền lành nhưng lại sở hữu sức hút chồng chất. Các em khóa dưới mê như điếu đổ, đỉnh điểm là có người còn tặng hẳn bánh handmade. Cường không cần thả thính, vũ trụ tự thính vào Cường.' },
  { id: 'hs8', img: 'https://scontent.fsgn2-6.fna.fbcdn.net/v/t1.15752-9/591133932_1201966645225670_32646175966546352_n.jpg?stp=dst-jpg_s2048x2048_tt6&_nc_cat=110&ccb=1-7&_nc_sid=9f807c&_nc_ohc=uSm1Yh1MHFMQ7kNvwE_1u2i&_nc_oc=AdnwVDbCYBagByNTxgGLK1WcUmnFvRlg2GwwHrKoYjvEFPVIZS7wUZLnq6jcqYWyUdY&_nc_zt=23&_nc_ht=scontent.fsgn2-6.fna&oh=03_Q7cD4AFWKBNC17Ty2dbVMiDHH6hQaibVpKF3XuZcyTj_8XON2Q&oe=695923F5', title: 'Trần Minh Đức', desc: 'Minh Đức là một học sinh có câu chuyện huyền thoại về cái răng đã ra đi nhưng phong độ thì ở lại. Đức vẫn cười, vẫn lầy, vẫn tung hứng pha trò như thể sự thiếu hụt ấy là một phụ kiện thời trang chứ không phải khuyết điểm.' },
  { id: 'hs9', img: 'https://scontent.fsgn2-8.fna.fbcdn.net/v/t1.15752-9/582261111_1319181916650305_8698108265821490622_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=9f807c&_nc_ohc=PVQv_3vWX54Q7kNvwHVbsw-&_nc_oc=AdlQjDyHw3vuundA6UZu2ygjVUe9YdR4Ni64MYweCABikHU3xgbYV63WaptyJcoOz9Y&_nc_zt=23&_nc_ht=scontent.fsgn2-8.fna&oh=03_Q7cD4AE7F2cxeJOEMytWf6gFjaZdrkwnnXXq-cnUbgDhgZQmaA&oe=6959254A', title: 'Hoàng Ngân Hà', desc: 'Hoàng Ngân Hà là một học sinh chú đà điểu chính hiệu của lớp với khả năng giả tiếng động vật ở level khiến cả sở thú phải nể. Hà có thể phi như ngựa, gáy như gà trống báo bình minh và chuyển giọng chỉ trong tích tắc. Mỗi lần Hà “biểu diễn”, lớp thì cười lăn còn giáo viên thì giật mình tưởng có động vật hoang dã xâm nhập trường. Nhờ tài năng âm thanh trời phú này, Hà chính thức trở thành nỗi ám ảnh ngọt ngào của thầy cô và là “ngôi sao hệ gây náo loạn” không ai thay thế được.' },
  { id: 'hs10', img: 'https://scontent.fsgn2-9.fna.fbcdn.net/v/t1.15752-9/577831150_1534186354296964_7512518283646774182_n.jpg?stp=dst-jpg_s2048x2048_tt6&_nc_cat=106&ccb=1-7&_nc_sid=9f807c&_nc_ohc=mWV64E-N3zYQ7kNvwFRTvOa&_nc_oc=Adm9h4KhQ8TO5kTRiI3HnYcffD6m2T0ra_kJHc1O6irfiRv36VU-eVsHjlxh_OnaYo0&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&oh=03_Q7cD4AFTRE9CA005frthWZ68o7bjNo92v7oTPUj8aJd-cYN_2g&oe=69594DAA', title: 'Nguyễn Nguyên Phương', desc: 'Nguyên Phương là một học sinh và đồng thời là bà hoàng Play Together, bá chủ mọi bản đồ trong game. Ở ngoài đời Phương bình thường, nhưng trong thế giới ảo, ai gặp Phương cũng phải cung kính ba phần để tránh bị “bay màu” không cần lý do.' }
];

const productsRoot = document.querySelector('#products');
const tmpl = document.querySelector('#product-template');
const ratings = loadRatings();

function render() {
  productsRoot.innerHTML = '';
  PRODUCTS.forEach(p => {
    const clone = tmpl.content.cloneNode(true);
    const card = clone.querySelector('.product-card');
    const img = clone.querySelector('.product-image');
    img.src = p.img;
    img.alt = p.title;
    clone.querySelector('.product-title').textContent = p.title;
    clone.querySelector('.product-desc').textContent = p.desc;

    const ratingEl = clone.querySelector('.rating');

    for (let i = 1; i <= 5; i++) {
      const btn = document.createElement('button');
      btn.className = 'star';
      btn.setAttribute('aria-label', i + ' sao');
      btn.setAttribute('data-value', i);
      btn.innerHTML = '★';

      btn.addEventListener('click', () => {
        if (!ratings[p.id]) ratings[p.id] = [];
        ratings[p.id].push(i);
        saveRatings(ratings);
        updateCard(p.id, card);
        updateFooterNote();
      });

      btn.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          btn.click();
        }
      });

      ratingEl.appendChild(btn);
    }

    const stats = calcStats(ratings[p.id]);
    clone.querySelector('.average').textContent = stats.avg.toFixed(1);
    clone.querySelector('.votes').textContent = `(${stats.count})`;
    applyFillStyles(card, stats.avg);

    productsRoot.appendChild(clone);

    if (p.id === 'hs10') {
      const tbc = document.createElement('div');
      tbc.style.fontSize = '22px';
      tbc.style.fontWeight = 'bold';
      tbc.style.textAlign = 'center';
      tbc.style.marginTop = '30px';
      tbc.textContent = '✨ TO BE CONTINUED... ✨';
      productsRoot.appendChild(tbc);
    }
  });
}

function applyFillStyles(cardEl, avg) {
  const buttons = cardEl.querySelectorAll('.star');
  buttons.forEach((b, idx) => {
    const val = idx + 1;
    if (val <= Math.round(avg)) b.classList.add('filled');
    else b.classList.remove('filled');
  });
}

function updateCard(productId, cardEl) {
  const avgEl = cardEl.querySelector('.average');
  const votesEl = cardEl.querySelector('.votes');
  const stats = calcStats(ratings[productId]);
  avgEl.textContent = stats.avg.toFixed(1);
  votesEl.textContent = `(${stats.count})`;
  applyFillStyles(cardEl, stats.avg);
}

function updateFooterNote() {
  try {
    localStorage.setItem('shopdemo_last_visit', new Date().toISOString());
    document.getElementById('storage-note').textContent = 'Đánh giá hiện được lưu cục bộ trên trình duyệt (localStorage).';
  } catch (e) {
    document.getElementById('storage-note').textContent = 'Trình duyệt của bạn không hỗ trợ localStorage — đánh giá sẽ không được lưu.';
  }
}

render();
document.getElementById('year').textContent = new Date().getFullYear();
updateFooterNote();
