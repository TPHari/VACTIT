export type ScoreBand = {
  min: number;
  max: number;
  message: string;
};

export const SUBJECT_TACTICS: Record<string, ScoreBand[]> = {
  vie: [
    {
      min: 0,
      max: 100,
      message: `Điểm thấp ở phần này thường không phải do bạn dở Tiếng Việt, mà do bạn chủ quan đấy. Tiếng Việt là tiếng mẹ đẻ, nhưng đề thi rất hay bẫy lỗi chính tả, lỗi dùng từ và yêu cầu một khả năng đọc hiểu cao. BaiLearn khuyên bạn đừng đọc lướt ẩu tả, rèn thói quen đọc chậm, đọc kỹ từng từ trong câu hỏi để tránh mất điểm oan uổng. Bạn hãy dành 3 ngày chỉ để ôn lại quy tắc chính tả và các cặp từ hay nhầm (như 'bàng quan' hay 'bàng quang'). Bên cạnh đó, hãy mở lại sách giáo khoa Ngữ văn lớp 10, 11, 12 và ôn thật kỹ các biện pháp tu từ (ẩn dụ, hoán dụ, nhân hóa...) cùng ngữ pháp câu tiếng Việt nhé!`,
    },
    {
      min: 101,
      max: 200,
      message: `Có vẻ bạn đã nắm được một số kiến thức cơ bản, nhưng đề thi ĐGNL rất thích 'gài bẫy' ở sự tinh tế của ngôn ngữ. Bạn có thể đọc hiểu tốt, nhưng lại thường lúng túng trước các dạng bài lỗi logic câu phức tạp (như sai quy chiếu, mơ hồ về nghĩa) hoặc các từ Hán Việt ít gặp. Chiến thuật lúc này là chủ động mở rộng vốn từ Hán Việt và luyện tập khả năng "biên tập viên" - tức là nhìn vào một câu văn và tìm ra lỗi sai về logic hoặc quan hệ từ. Khi đọc văn bản, đừng chỉ đọc để hiểu nội dung, hãy tự đặt câu hỏi phản biện: "Tại sao tác giả lại chọn cách diễn đạt này mà không phải cách kia?". Chính sự nhạy cảm với sắc thái biểu cảm này sẽ giúp bạn bứt phá điểm số.`,
    },
    {
      min: 201,
      max: 299,
      message: `Tuyệt vời! Bạn có tư duy ngôn ngữ rất sắc bén. Nhưng cẩn thận nhé, để chạm tới mức điểm tối đa, kẻ thù lớn nhất không còn là kiến thức mà là tâm lý "suy diễn quá đà". Các bạn giỏi thường có xu hướng phân tích sâu xa hơn mức cần thiết, dẫn đến việc chọn sai ở những câu hỏi đa nghĩa hoặc các phương án gây nhiễu. Lời khuyên của BaiLearn là hãy tin vào trực giác đầu tiên và giữ một "cái đầu lạnh". Hãy luyện đề với áp lực thời gian cao hơn thực tế (rút ngắn 15-20% thời gian) để rèn phản xạ. Đặc biệt, hãy sử dụng triệt để phương pháp loại trừ để tìm ra đáp án "đúng nhất" dựa trên văn bản, chứ không phải đáp án nghe có vẻ hay hay hợp lý theo suy luận chủ quan.`,
    },
    {
      min: 300,
      max: 300,
      message: `Bạn là vua Tiếng Việt, là chúa tể ngôn từ. Đỉnh nóc, kịch trần! Bạn đã né sạch mọi cái bẫy chính tả và logic câu của người ra đề. Tư duy ngôn ngữ sắc bén thế này thì ai làm lại bạn? Bạn đọc vị tác giả như đọc suy nghĩ của chính mình vậy. Khả năng cảm thụ văn học và tư duy tiếng Việt của bạn đúng là 'out trình'!`,
    },
  ],
  eng: [
    {
      min: 0,
      max: 100,
      message: `Đừng hoảng nhé! Nếu bạn cảm thấy mất gốc, đừng cố nhồi nhét những ngữ pháp cao siêu. BaiLearn gợi ý chiến thuật cho bạn là: "Từ vựng là cốt lõi". Hãy học thuộc lòng 500 từ vựng thông dụng nhất, thường gặp nhất trong các đề thi. Khi làm bài đọc hiểu, hãy áp dụng kỹ năng Scanning: đọc câu hỏi trước để xác định từ khóa (keyword), sau đó dò ngược lên bài đọc để tìm manh mối. Đừng cố dịch cả bài, hãy "săn" đáp án xung quanh các từ khóa đó, bạn chỉ cần kiên nhẫn dò tìm là đã gỡ được rất nhiều điểm rồi. Về ngữ pháp, chỉ cần nắm chắc "bộ ba quyền lực": thì Quá khứ đơn, thì Hiện tại hoàn thành và các loại Câu điều kiện là đã đủ để xử lý phần lớn câu hỏi cơ bản.`,
    },
    {
      min: 101,
      max: 200,
      message: `Bạn đang ở mức khá. Ở mức độ này, sai lầm phổ biến là thói quen dịch từng từ sang tiếng Việt, làm chậm tốc độ và sai lệch ngữ cảnh. Hãy thay đổi cách học: học từ theo cụm (collocations). Ví dụ, thay vì chỉ học từ decision, hãy học cụm make a decision. Đây là lúc cần luyện kỹ năng Skimming (đọc lướt) để nắm bắt ý chính của đoạn văn trong vòng 30 giây. Hãy tập trung cải thiện năng lực xử lý các dạng câu hỏi khó hơn như tìm Ý chính (Main idea) và câu hỏi Suy luận (Inference), chuyển từ việc "biết nghĩa" sang "hiểu sâu" nội dung. Bên cạnh đó, bạn hãy cố gắng củng cố thêm các kiến thức ngữ pháp mà mình bị sai trong bài thi và trau dồi thêm vốn từ vựng nhé!`,
    },
    {
      min: 201,
      max: 299,
      message: `Để đạt điểm giỏi và xuất sắc, bạn cần sự tỉ mỉ tuyệt đối. Sự khác biệt nằm ở khả năng xử lý các bài đọc thuộc chủ đề lạ và khó như Kinh tế, Khoa học, hay Môi trường mà không bị "khớp" bởi từ vựng chuyên ngành. Hãy rà soát lại những lỗi ngữ pháp "siêu nhỏ" nhưng cực kỳ dễ mất điểm như sự hòa hợp chủ ngữ - động từ trong câu phức hay cấu trúc đảo ngữ. Chiến thuật ôn luyện lúc này là giải đề với độ chính xác tuyệt đối, đặc biệt cảnh giác với các bẫy trong câu hỏi suy luận sâu để không mất điểm nhé!`,
    },
    {
      min: 300,
      max: 300,
      message: `Bạn là chiến thần ngoại ngữ - OMG, you are a Walking Dictionary. Excuse me? Bạn là người bản xứ trà trộn vào đi thi đúng không? 300 điểm tuyệt đối, bạn xử lý các câu hỏi mượt như Sunsilk. Level này chắc IELTS 9.0 cũng phải dè chừng kkkkk.`,
    },
  ],
  math: [
    {
      min: 0,
      max: 100,
      message: `Nhìn đề toán có vẻ đáng sợ với đa dạng bài trải dài từ kiến thức lớp 10 đến 12, nhưng bạn hãy bình tĩnh. Nếu bạn đang mất gốc những kiến thức nền tảng, đừng lao đầu giải bài tập vội. Hãy ôn lại thật chắc những kiến thức căn bản (BaiLearn gợi ý cho bạn một số chủ đề như: Ứng dụng đạo hàm để khảo sát hàm số, Không gian Oxy và Oxyz, Hình học không gian, Tổ hợp - Xác suất, Dãy số - Giới hạn, Phương trình - Hệ phương trình, Quy hoạch tuyến tính,...). Đặc biệt, hãy học cách sử dụng máy tính cầm tay (casio) để hỗ trợ giải các bài toán nhanh. Chỉ cần làm đúng các câu cơ bản, bạn đã có một số điểm an toàn.`,
    },
    {
      min: 101,
      max: 200,
      message: `Khi nền tảng đã vững, vấn đề của bạn là tốc độ. Đã đến lúc chuyển từ tư duy giải tự luận sang tư duy trắc nghiệm. Hãy trang bị cho mình các kỹ thuật giải nhanh và rèn luyện kỹ năng sử dụng máy tính cầm tay một cách thành thạo để giải nhanh ra kết quả. Hãy tập trung ôn luyện vào các chuyên đề có trọng số điểm lớn như Khảo sát hàm số, Xác suất,... Đồng thời, bạn cũng nên cố gắng rèn luyện tốt chiến thuật phân bổ thời gian hợp lý nữa nhé!`,
    },
    {
      min: 201,
      max: 299,
      message: `Bạn khá ổn ở phần toán học rồi. Để đạt điểm tối đa, bạn cần rèn luyện "tư duy lối tắt". Trước mỗi bài toán, hãy tự hỏi: "Có cách nhìn nào khác để ra đáp án nhanh hơn không?" thay vì lao vào tính toán ngay. Thử thách của bạn nằm ở các câu hỏi vận dụng cao phức tạp. Chiến thuật cho bạn là luyện các phương pháp giải nhanh trắc nghiệm. Hãy rèn luyện áp lực thời gian thật gắt gao: 1 phút mỗi câu. Một sai sót nhỏ trong tính toán ở bước đầu sẽ khiến công sức cả bài đổ sông đổ bể, nên hãy rèn thói quen kiểm tra lại (double-check). Ngoài ra, bạn nên luyện tập thêm một số mẹo sử dụng máy tính cầm tay để tối ưu tốc độ làm bài nhé!`,
    },
    {
      min: 300,
      max: 300,
      message: `Máy tính chạy bằng cơm hả trời. Tốc độ xử lý của bạn còn nhanh hơn cả người yêu cũ trở mặt! Giải trắc nghiệm Toán mà cứ như đi dạo trong công viên thế này thì ai chơi lại?`,
    },
  ],
  sci: [
    {
      min: 0,
      max: 100,
      message: `Rất nhiều bạn sợ phần này vì kiến thức quá rộng từ Lý, Hóa đến Sử, Địa. Nhưng nghe BaiLearn này: Đừng lo vì đề thi ĐGNL cung cấp kiến thức ngay trong bài, tất cả định nghĩa và công thức đều có sẵn. Nhiệm vụ của bạn là đọc hiểu văn bản khoa học và nhặt dữ kiện để trả lời. Bí quyết để bứt phá ở mức điểm này là rèn kỹ năng đọc hiểu. Mỗi ngày, bạn nên tìm đọc một đoạn văn về quy trình sản xuất axit hay về một triều đại lịch sử, cố gắng hiểu chúng rồi hỏi đáp với bạn bè. Trong đề thi, chỉ cần bạn chịu khó đọc kỹ, biết cách suy luận từ dữ kiện là bạn đã có thể lấy được 80% số điểm mà không cần kiến thức nền quá sâu. Với các câu Logic, hãy bình tĩnh tóm tắt các quy luật ra nháp, xét từ từ các trường hợp, đừng đoán mò nhé (phần này nhiều điểm á).`,
    },
    {
      min: 101,
      max: 200,
      message: `Bạn đang gặp khó khăn vì sự "lệch tủ" đúng không? Dân tự nhiên thì sợ Sử Địa, dân xã hội thì sợ Lý Hóa. Nhưng nghe BaiLearn này: Đừng lo lắng vì đề thi ĐGNL cung cấp kiến thức ngay trong bài, tất cả định nghĩa và công thức đều có sẵn. Nhiệm vụ của bạn là đọc hiểu văn bản khoa học và nhặt dữ kiện để trả lời. Bí quyết để bứt phá ở mức điểm này là rèn kỹ năng đọc hiểu. Mỗi ngày, bạn nên tìm đọc một đoạn văn về quy trình sản xuất axit hay về một triều đại lịch sử, cố gắng hiểu chúng rồi hỏi đáp với bạn bè. Trong đề thi, chỉ cần bạn chịu khó đọc kỹ, biết cách suy luận từ dữ kiện là bạn đã có thể lấy được 80% số điểm mà không cần kiến thức nền quá sâu. Ngoài ra, phần Logic bạn nên rèn luyện tính cẩn thận hơn trong việc suy luận nhé!`,
    },
    {
      min: 201,
      max: 299,
      message: `Bạn có nền tảng kiến thức rộng và tư duy tốt. Thử thách cuối cùng dành cho bạn là tăng tốc độ xử lý các bài toán Logic phức tạp và các câu hỏi suy luận khoa học tổng hợp. Hãy luyện thói quen tóm tắt đề, xét kỹ các trường hợp cho các bài toán Logic để không bị bỏ sót. Với suy luận khoa học, hãy rèn tốc độ đọc - hiểu - suy luận, cố gắng đoán được dụng ý của người ra đề. Hãy nhớ là sự cẩn trọng trong từng suy luận nhỏ sẽ giúp bạn chinh phục mức điểm tuyệt đối.`,
    },
    {
      min: 300,
      max: 300,
      message: `Bạn là giáo sư biết tuốt. Thám tử lừng danh Conan chắc cũng phải gọi bạn bằng sư phụ! Bạn xâu chuỗi dữ kiện và suy luận quá logic, quá sắc sảo. 300 điểm là phần thưởng xứng đáng cho 'bộ não thiên tài' này!`,
    },
  ],
};
