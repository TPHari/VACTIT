export type ScoreBand = {
  min: number;
  max: number;
  messages: string[];
};

export const SUBJECT_TACTICS: Record<string, ScoreBand[]> = {
  vie: [
    {
      min: 0,
      max: 100,
      messages: [
        `Điểm thấp ở phần này thường không phải do bạn dở Tiếng Việt, mà do bạn chủ quan đấy. Tiếng Việt là tiếng mẹ đẻ, nhưng đề thi rất hay bẫy lỗi chính tả, lỗi dùng từ và yêu cầu một khả năng đọc hiểu cao. BaiLearn khuyên bạn đừng đọc lướt ẩu tả, rèn thói quen đọc chậm, đọc kỹ từng từ trong câu hỏi để tránh mất điểm oan uổng. Bạn hãy dành 3 ngày chỉ để ôn lại quy tắc chính tả và các cặp từ hay nhầm (như 'bàng quan' hay 'bàng quang'). Bên cạnh đó, hãy mở lại sách giáo khoa Ngữ văn lớp 10, 11, 12 và ôn thật kỹ các biện pháp tu từ (ẩn dụ, hoán dụ, nhân hóa...) cùng ngữ pháp câu tiếng Việt nhé!`,
        `Điểm số hiện tại  không phải cho thấy bạn kém Tiếng Việt, mà nguyên nhân chính là sự chủ quan. Đề thi thường giăng bẫy ở lỗi chính tả và dùng từ, đòi hỏi sự tỉ mỉ cao. Chiến lược khắc phục: Bạn cần thay đổi ngay thói quen đọc lướt ẩu tả sang đọc chậm, soi kỹ từng từ trong câu hỏi. Hãy lên lịch dành hẳn 3 ngày chỉ để hệ thống hóa quy tắc chính tả và phân biệt các cặp từ dễ gây nhầm lẫn (ví dụ điển hình như 'bàng quan' và 'bàng quang'). Song song đó, hãy mở lại sách giáo khoa Ngữ văn lớp 10, 11, 12 để ôn tập thật sâu các biện pháp tu từ (ẩn dụ, hoán dụ, nhân hóa...) và nắm chắc ngữ pháp câu.`,
        `Điểm số hiện tại phản ánh sự chủ quan hơn là năng lực. Để khắc phục, đây là To-do list dành cho bạn:\n1. Thay đổi thái độ: Ngưng đọc lướt. Bắt buộc rèn thói quen đọc kỹ từng từ để tránh mất điểm oan.\n2. Chiến dịch 3 ngày: Tập trung toàn lực ôn quy tắc chính tả và các từ dễ sai (như bàng quan vs bàng quang).\n3. Ôn tập kiến thức nền tảng trong SGK: Rà soát lại kiến thức Văn 10, 11, 12.\n4. Trọng tâm kiến thức: Thành thạo các biện pháp tu từ (nhân hóa, ẩn dụ, hoán dụ) và cấu trúc ngữ pháp tiếng Việt.\nBạn không dở, bạn chỉ đang vội vàng thôi!`,
        `Thật ra bạn không dở Tiếng Việt đâu, tiếng mẹ đẻ mà! Vấn đề là bạn đang bị "bẫy" vì chủ quan đấy. Đề thi hay đánh đố lỗi chính tả với dùng từ lắm, nên lời khuyên chân thành là: Đừng đọc lướt nữa! Hãy tập đọc chậm lại, soi kỹ từng chữ. Bạn thử dành 3 ngày chỉ để học lại chính tả với mấy cặp từ hay nhầm kiểu "bàng quan - bàng quang" xem. Tiện tay mở lại sách Văn cấp 3 (lớp 10-12) ôn kỹ mấy cái ẩn dụ, hoán dụ, nhân hóa với ngữ pháp câu nhé. Cẩn thận là điểm lên ngay!`,
      ],
    },
    {
      min: 101,
      max: 200,
      messages: [
        `Có vẻ bạn đã nắm được một số kiến thức cơ bản, nhưng đề thi ĐGNL rất thích 'gài bẫy' ở sự tinh tế của ngôn ngữ. Bạn có thể đọc hiểu tốt, nhưng lại thường lúng túng trước các dạng bài lỗi logic câu phức tạp (như sai quy chiếu, mơ hồ về nghĩa) hoặc các từ Hán Việt ít gặp. Chiến thuật lúc này là chủ động mở rộng vốn từ Hán Việt và luyện tập khả năng "biên tập viên" - tức là nhìn vào một câu văn và tìm ra lỗi sai về logic hoặc quan hệ từ. Khi đọc văn bản, đừng chỉ đọc để hiểu nội dung, hãy tự đặt câu hỏi phản biện: "Tại sao tác giả lại chọn cách diễn đạt này mà không phải cách kia?". Chính sự nhạy cảm với sắc thái biểu cảm này sẽ giúp bạn bứt phá điểm số.`,
        `Bạn đã có nền tảng tốt, nhưng đề thi ĐGNL đòi hỏi sự tinh tế hơn thế. Điểm yếu của bạn nằm ở các dạng bài lỗi logic phức tạp (như sai quy chiếu, nghĩa mơ hồ) và vốn từ Hán Việt còn mỏng. Giải pháp: Chiến thuật chủ chốt lúc này là chủ động nạp thêm từ vựng Hán Việt. Hãy nâng cấp tư duy đọc hiểu bằng cách tự đặt câu hỏi phản biện: "Tại sao tác giả dùng từ này mà không phải từ kia?". Đặc biệt, hãy rèn luyện kỹ năng của một "biên tập viên": nhìn vào câu văn là phải phát hiện ngay lỗi sai về logic hoặc quan hệ từ. Sự nhạy cảm này là chìa khóa bứt phá.`,
        `Trùng sinh trước ngày thi ĐGNL, tôi nhận được hệ thống nhiệm vụ nâng cấp level Tiếng Việt:\n1. Mục tiêu: Xử lý triệt để các câu hỏi "gài bẫy" về sự tinh tế ngôn ngữ.\n2. Lỗ hổng cần lấp: Các lỗi logic câu phức tạp (mơ hồ, sai quy chiếu) và từ Hán Việt ít gặp.\n3. Phương pháp:\n- Luyện tư duy "Biên tập viên": Tìm lỗi sai logic/quan hệ từ trong câu.\n- Luyện tư duy Phản biện: Luôn tự hỏi lý do tác giả chọn cách diễn đạt đó.\n4. Nhiệm vụ phụ: Mở rộng tối đa vốn từ Hán Việt.\n5. Phần thưởng: Đậu NV1.`,
        `Có vẻ bạn đã nắm được cơ bản rồi, nhưng coi chừng dính bẫy sự "tinh tế" của đề thi nha! Bạn hay bị lúng túng trước mấy từ Hán Việt lạ hoặc mấy câu bị lỗi logic lắt léo (kiểu sai quy chiếu, mơ hồ). Bí kíp cho bạn là hãy tập làm "biên tập viên" khó tính: đọc câu nào soi lỗi logic và quan hệ từ câu đó. Khi đọc văn bản, đừng chỉ lướt qua nội dung, hãy tự hỏi: "Sao tác giả viết thế này?". Chính sự soi xét kỹ lưỡng và vốn từ Hán Việt sẽ giúp bạn vượt ngưỡng điểm này.`,
      ],
    },
    {
      min: 201,
      max: 299,
      messages: [
        `Tuyệt vời! Bạn có tư duy ngôn ngữ rất sắc bén. Nhưng cẩn thận nhé, để chạm tới mức điểm tối đa, kẻ thù lớn nhất không còn là kiến thức mà là tâm lý "suy diễn quá đà". Các bạn giỏi thường có xu hướng phân tích sâu xa hơn mức cần thiết, dẫn đến việc chọn sai ở những câu hỏi đa nghĩa hoặc các phương án gây nhiễu. Lời khuyên của BaiLearn là hãy tin vào trực giác đầu tiên và giữ một "cái đầu lạnh". Hãy luyện đề với áp lực thời gian cao hơn thực tế (rút ngắn 15-20% thời gian) để rèn phản xạ. Đặc biệt, hãy sử dụng triệt để phương pháp loại trừ để tìm ra đáp án "đúng nhất" dựa trên văn bản, chứ không phải đáp án nghe có vẻ hay hay hợp lý theo suy luận chủ quan.`,
        `Bạn có tư duy ngôn ngữ rất sắc bén, nhưng "kẻ thù" ngăn bạn đạt điểm tối đa chính là thói quen suy diễn quá đà. Việc phân tích sâu xa hơn mức cần thiết thường dẫn đến sai lầm ở các câu hỏi đa nghĩa hoặc phương án gây nhiễu. Chiến thuật: Hãy giữ cái đầu lạnh và tin vào trực giác đầu tiên. Khi ôn luyện, hãy tự tạo áp lực bằng cách rút ngắn 15-20% thời gian làm bài để rèn phản xạ. Nguyên tắc vàng: Sử dụng triệt để phương pháp loại trừ để chọn đáp án "đúng nhất" dựa hoàn toàn trên văn bản, tuyệt đối không chọn đáp án chỉ vì nghe có vẻ hợp lý theo suy luận chủ quan.`,
        `Chiến thuật Về đích:\n- Hãy kiểm soát xu hướng "phân tích sâu". Đừng phức tạp hóa vấn đề. Tin vào trực giác đầu tiên.\n- Kỹ thuật: Áp dụng triệt để phương pháp loại trừ. Chọn đáp án bám sát văn bản, gạt bỏ suy luận chủ quan.\n- Bài tập: Giải đề với áp lực thời gian gắt gao (giảm 15-20% thời gian chuẩn) để rèn phản xạ tự nhiên, tránh nghĩ ngợi lung tung.`,
        `Tuyệt vời! Tư duy bạn rất tốt, nhưng coi chừng "thông minh quá bị hại". Các bạn giỏi thường hay suy diễn sâu xa quá mức cần thiết, thành ra chọn sai mấy câu gây nhiễu. Lời khuyên của mình: Tin vào cảm giác đầu tiên đi, giữ cái đầu lạnh! Đừng chọn đáp án vì "nghe có vẻ hay", hãy chọn đáp án "đúng nhất" có trong bài bằng phương pháp loại trừ. À, nhớ luyện đề ép thời gian (nhanh hơn 15-20%) để bớt thời gian ngồi suy diễn lung tung nhé!`,
      ],
    },
    {
      min: 300,
      max: 300,
      messages: [
        `Bạn là vua Tiếng Việt, là chúa tể ngôn từ. Đỉnh nóc, kịch trần! Bạn đã né sạch mọi cái bẫy chính tả và logic câu của người ra đề. Tư duy ngôn ngữ sắc bén thế này thì ai làm lại bạn? Bạn đọc vị tác giả như đọc suy nghĩ của chính mình vậy. Khả năng cảm thụ văn học và tư duy tiếng Việt của bạn đúng là 'out trình'!`,
        `Bạn đã đạt đến cảnh giới cao nhất của tư duy ngôn ngữ Tiếng Việt. Mọi bẫy về chính tả hay logic đều bị bạn vô hiệu hóa hoàn toàn. Khả năng thấu hiểu ý đồ tác giả và cảm thụ văn học của bạn thực sự vượt trội và đáng nể phục.`,
        `"Đỉnh nóc, kịch trần, bay phấp phới" là đây chứ đâu! Bạn chính là "Vua Tiếng Việt" trong truyền thuyết. Mấy cái bẫy của người ra đề với bạn chỉ là "muỗi". Tư duy ngôn ngữ cỡ này thì đúng là "out trình", không còn gì để bàn cãi nữa!`,
        `Tuyệt đối! Bạn đọc vị người ra đề như đọc sách. Không một lỗi sai nào có thể qua mắt bạn. Trình độ Tiếng Việt và tư duy logic của bạn đã đạt mức thượng thừa. 10 điểm không có nhưng!`,
      ],
    },
  ],
  eng: [
    {
      min: 0,
      max: 100,
      messages: [
        `Đừng hoảng nhé! Nếu bạn cảm thấy mất gốc, đừng cố nhồi nhét những ngữ pháp cao siêu. BaiLearn gợi ý chiến thuật cho bạn là: "Từ vựng là cốt lõi". Hãy học thuộc lòng 500 từ vựng thông dụng nhất, thường gặp nhất trong các đề thi. Khi làm bài đọc hiểu, hãy áp dụng kỹ năng Scanning: đọc câu hỏi trước để xác định từ khóa (keyword), sau đó dò ngược lên bài đọc để tìm manh mối. Đừng cố dịch cả bài, hãy "săn" đáp án xung quanh các từ khóa đó, bạn chỉ cần kiên nhẫn dò tìm là đã gỡ được rất nhiều điểm rồi. Về ngữ pháp, chỉ cần nắm chắc "bộ ba quyền lực": thì Quá khứ đơn, thì Hiện tại hoàn thành và các loại Câu điều kiện là đã đủ để xử lý phần lớn câu hỏi cơ bản.`,
        `Đừng hoảng loạn nếu cảm thấy mất gốc. Thay vì cố nhồi nhét ngữ pháp cao siêu, hãy áp dụng chiến thuật "Từ vựng là cốt lõi". Mục tiêu của bạn là học thuộc lòng 500 từ vựng thông dụng nhất thường gặp trong đề thi. Kỹ năng làm bài: Với bài đọc hiểu, tuyệt đối đừng cố dịch cả bài. Hãy dùng kỹ năng Scanning: Đọc câu hỏi trước để xác định từ khóa (keyword), sau đó dò ngược lên bài đọc và "săn" đáp án xung quanh các từ khóa đó. Về ngữ pháp, chỉ cần nắm chắc "bộ ba quyền lực": thì Quá khứ đơn, thì Hiện tại hoàn thành và các loại Câu điều kiện là đủ để xử lý phần lớn câu hỏi cơ bản.`,
        `BaiLearn gợi ý cho bạn công thức thoát "liệt" như sau:\n- Từ vựng: Học ngay 500 từ vựng cốt lõi, thường gặp nhất.\n- Chiến thuật Đọc hiểu: Không dịch toàn bài. Sử dụng Scanning: Tìm keyword ở câu hỏi -> Dò lên bài -> Chọn đáp án.\n- Trọng tâm vào các thì và các câu trúc câu căn bản như: Quá khứ đơn, Hiện tại hoàn thành, Câu điều kiện.\nKiên nhẫn theo cách này sẽ giúp bạn gỡ được rất nhiều điểm.`,
        `Mất gốc không sao cả, đừng cố học cái gì cao siêu quá! Chiến thuật cho bạn là tập trung vào từ vựng: học thuộc lòng 500 từ hay gặp nhất thôi. Khi làm bài đọc, đừng có ngồi dịch hết bài nha. Bạn cứ đọc câu hỏi, lấy từ khóa (keyword) rồi dò ngược lên bài đọc, đáp án nó nằm quanh đó thôi – kỹ năng này gọi là Scanning đấy. Về ngữ pháp, hãy nắm chắc các thì và ngữ pháp câu căn bản như "bộ ba quyền lực": Quá khứ đơn, Hiện tại hoàn thành với Câu điều kiện là đủ xài rồi!`,
      ],
    },
    {
      min: 101,
      max: 200,
      messages: [
        `Bạn đang ở mức khá. Ở mức độ này, sai lầm phổ biến là thói quen dịch từng từ sang tiếng Việt, làm chậm tốc độ và sai lệch ngữ cảnh. Hãy thay đổi cách học: học từ theo cụm (collocations). Ví dụ, thay vì chỉ học từ decision, hãy học cụm make a decision. Đây là lúc cần luyện kỹ năng Skimming (đọc lướt) để nắm bắt ý chính của đoạn văn trong vòng 30 giây. Hãy tập trung cải thiện năng lực xử lý các dạng câu hỏi khó hơn như tìm Ý chính (Main idea) và câu hỏi Suy luận (Inference), chuyển từ việc "biết nghĩa" sang "hiểu sâu" nội dung. Bên cạnh đó, bạn hãy cố gắng củng cố thêm các kiến thức ngữ pháp mà mình bị sai trong bài thi và trau dồi thêm vốn từ vựng nhé!`,
        `Ở mức khá, sai lầm phổ biến kìm hãm bạn là thói quen dịch từng từ (word-by-word) sang tiếng Việt, làm chậm tốc độ và sai lệch ngữ cảnh. Cải thiện: Hãy chuyển sang học từ theo cụm (collocations). Ví dụ: thay vì học từ decision, hãy học cụm make a decision. Đây là lúc cần luyện kỹ năng Skimming (đọc lướt) để nắm bắt ý chính đoạn văn trong vòng 30 giây. Hãy nâng cao năng lực xử lý các câu hỏi khó như Tìm ý chính (Main idea) và Suy luận (Inference) – chuyển từ "biết nghĩa" sang "hiểu sâu". Đừng quên rà soát và củng cố lại những kiến thức ngữ pháp bạn hay bị sai nhé.`,
        `Với mức điểm hiện tại của bạn, BaiLearn gợi ý các chiến lược như sau:\n- Từ vựng: Bỏ cách học từ đơn lẻ. Học theo Collocations (cụm từ), ví dụ: học make a decision thay vì chỉ decision.\n- Kỹ năng đọc: Rèn Skimming – đọc lướt để nắm ý chính.\n- Tư duy: Chuyển từ dịch nghĩa sang hiểu sâu nội dung để làm tốt dạng câu hỏi Main idea (Ý chính) và Inference (Suy luận).\n- Lưu ý: Khắc phục triệt để các lỗi ngữ pháp cũ và tiếp tục bồi dưỡng vốn từ.`,
        `Bạn đang ở mức khá, nhưng muốn lên điểm thì đừng nên dịch từng từ (word-by-word), vì nó vừa chậm vừa dễ hiểu sai! Thay đổi cách học từ vựng theo cụm (collocations), ví dụ học nguyên cụm make a decision. Tập kỹ năng Skimming (đọc lướt) để nắm ý chính trong 30 giây thôi. Giờ là lúc phải tập trung vào mấy câu khó như Ý chính (Main idea) hay Suy luận (Inference), đòi hỏi bạn phải "hiểu sâu" chứ không chỉ biết mặt chữ. Cố gắng vá mấy lỗ hổng ngữ pháp hay sai nữa là ổn!`,
      ],
    },
    {
      min: 201,
      max: 299,
      messages: [
        `Để đạt điểm giỏi và xuất sắc, bạn cần sự tỉ mỉ tuyệt đối. Sự khác biệt nằm ở khả năng xử lý các bài đọc thuộc chủ đề lạ và khó như Kinh tế, Khoa học, hay Môi trường mà không bị "khớp" bởi từ vựng chuyên ngành. Hãy rà soát lại những lỗi ngữ pháp "siêu nhỏ" nhưng cực kỳ dễ mất điểm như sự hòa hợp chủ ngữ - động từ trong câu phức hay cấu trúc đảo ngữ. Chiến thuật ôn luyện lúc này là giải đề với độ chính xác tuyệt đối, đặc biệt cảnh giác với các bẫy trong câu hỏi suy luận sâu để không mất điểm nhé!`,
        `Để đạt điểm Giỏi/Xuất sắc, sự tỉ mỉ là yếu tố tiên quyết. Sự khác biệt nằm ở bản lĩnh xử lý các bài đọc thuộc chủ đề lạ và khó như Kinh tế, Khoa học, hay Môi trường mà không bị "khớp" bởi từ vựng chuyên ngành. Chiến thuật: Hãy rà soát lại những lỗi ngữ pháp "siêu nhỏ" nhưng cực dễ mất điểm như sự hòa hợp chủ ngữ - động từ trong câu phức hay cấu trúc đảo ngữ. Mục tiêu lúc này là giải đề với độ chính xác tuyệt đối. Đặc biệt, hãy nâng cao cảnh giác với các bẫy trong câu hỏi suy luận sâu để bảo toàn điểm số.`,
        `Đây sẽ là chiến lược để Top đầu:\n1. Làm quen với các bài đọc chủ đề khó (Kinh tế, Môi trường, Khoa học) để không bị ngợp từ chuyên ngành.\n2. Kiểm tra kỹ các cấu trúc ngữ pháp nhỏ nhặt (Đảo ngữ, Hòa hợp chủ ngữ - động từ trong câu phức).\n3. Giải đề hướng tới sự chính xác tuyệt đối (100%). Cực kỳ cẩn trọng với các bẫy tinh vi trong câu hỏi suy luận sâu.`,
        `Muốn điểm xuất sắc thì phải kỹ tính tuyệt đối! Bạn phải luyện sao cho gặp mấy bài đọc về Kinh tế, Khoa học hay Môi trường là không được sợ, không được bị "khớp" từ vựng. Hãy ôn lại mấy cái ngữ pháp "siêu nhỏ" như sự hòa hợp chủ ngữ - động từ hay đảo ngữ, vì đây là chỗ dễ mất điểm oan nhất. Chiến thuật bây giờ là làm đề phải đúng tuyệt đối, soi thật kỹ mấy cái bẫy trong câu hỏi suy luận sâu nhé!`,
      ],
    },
    {
      min: 300,
      max: 300,
      messages: [
        `Bạn là chiến thần ngoại ngữ - OMG, you are a Walking Dictionary. Excuse me? Bạn là người bản xứ trà trộn vào đi thi đúng không? 300 điểm tuyệt đối, bạn xử lý các câu hỏi mượt như Sunsilk. Level này chắc IELTS 9.0 cũng phải dè chừng kkkkk.`,
        `"Walking Dictionary" chính là danh xưng dành cho bạn. Khả năng ngôn ngữ của bạn tiệm cận người bản xứ, xử lý mọi câu hỏi mượt mà và chuẩn xác. Với trình độ này, có lẽ các kỳ thi quốc tế như IELTS cũng không làm khó được bạn. Một kết quả hoàn hảo!`,
        `Excuse me? Bạn là người bản xứ đi thi hộ đúng không? 300 điểm tròn trĩnh, xử lý đề mượt như Sunsilk thế này thì ai chơi lại? Tầm này thì IELTS 9.0 chắc cũng phải "rén" trước bạn đấy. Quá xuất sắc!`,
        `Chiến thần ngoại ngữ đây rồi! Bạn nuốt trọn đề thi không sót câu nào. Từ vựng, ngữ pháp, tư duy... tất cả đều hoàn hảo. Bạn quá đẳng cấp!`,
      ],
    },
  ],
  math: [
    {
      min: 0,
      max: 100,
      messages: [
        `Nhìn đề toán có vẻ đáng sợ với đa dạng bài trải dài từ kiến thức lớp 10 đến 12, nhưng bạn hãy bình tĩnh. Nếu bạn đang mất gốc những kiến thức nền tảng, đừng lao đầu giải bài tập vội. Hãy ôn lại thật chắc những kiến thức căn bản (BaiLearn gợi ý cho bạn một số chủ đề như: Ứng dụng đạo hàm để khảo sát hàm số, Không gian Oxy và Oxyz, Hình học không gian, Tổ hợp - Xác suất, Dãy số - Giới hạn, Phương trình - Hệ phương trình, Quy hoạch tuyến tính,...). Đặc biệt, hãy học cách sử dụng máy tính cầm tay (casio) để hỗ trợ giải các bài toán nhanh. Chỉ cần làm đúng các câu cơ bản, bạn đã có một số điểm an toàn.`,
        `Đừng để sự đa dạng của đề Toán làm bạn hoảng sợ. Nếu đang mất gốc, đừng vội lao đầu vào giải bài tập ngay. Hãy bình tĩnh ôn lại thật chắc các kiến thức căn bản theo gợi ý của BaiLearn: Ứng dụng đạo hàm, Hình không gian, Oxy & Oxyz, Tổ hợp - Xác suất, Dãy số - Giới hạn, Phương trình - Hệ phương trình, Quy hoạch tuyến tính. Công cụ: Đặc biệt, hãy học cách sử dụng máy tính cầm tay (Casio) để hỗ trợ giải nhanh. Chỉ cần làm đúng hết các câu cơ bản, bạn đã có một số điểm an toàn rồi.`,
        `Để thực hiện chiến dịch 'cứu điểm' thành công, bạn cần tuân thủ kỷ luật sắt: tuyệt đối không sa đà vào bài khó khi chưa vững gốc. Hãy dành toàn bộ thời gian để ôn chắc các chuyên đề trọng tâm gồm Đạo hàm, Hình không gian, Oxy - Oxyz, Tổ hợp - Xác suất, Dãy số, Phương trình và Quy hoạch tuyến tính. Bên cạnh kiến thức, hãy biến chiếc máy tính Casio thành vũ khí đắc lực giúp giải quyết nhanh gọn các bài toán định lượng. Mục tiêu tối thượng lúc này không phải là sự xuất sắc hào nhoáng, mà là sự chính xác tuyệt đối ở các câu cơ bản để đảm bảo vững chắc ngưỡng điểm an toàn.`,
        `Nhìn đề Toán từ lớp 10 đến 12 sợ thật, nhưng bình tĩnh nhé! Mất gốc thì đừng lao đầu giải bài vội. Ôn lại mấy cái căn bản trước đi: Ứng dụng đạo hàm để khảo sát đồ thị hàm số, Không gian Oxy & Oxyz, Xác suất, Giải phương trình - Hệ phương trình, Giới hạn.... Quan trọng nhất là phải biết bấm máy tính Casio để giải nhanh mấy bài dễ. Bạn chỉ cần làm đúng mấy câu cơ bản này thôi là điểm số an toàn rồi, không cần lo quá đâu!`,
      ],
    },
    {
      min: 101,
      max: 200,
      messages: [
        `Khi nền tảng đã vững, vấn đề của bạn là tốc độ. Đã đến lúc chuyển từ tư duy giải tự luận sang tư duy trắc nghiệm. Hãy trang bị cho mình các kỹ thuật giải nhanh và rèn luyện kỹ năng sử dụng máy tính cầm tay một cách thành thạo để giải nhanh ra kết quả. Hãy tập trung ôn luyện vào các chuyên đề có trọng số điểm lớn như Khảo sát hàm số, Xác suất,... Đồng thời, bạn cũng nên cố gắng rèn luyện tốt chiến thuật phân bổ thời gian hợp lý nữa nhé!`,
        `Khi nền tảng đã vững, vấn đề cốt lõi của bạn là tốc độ. Đã đến lúc chuyển từ tư duy giải tự luận sang tư duy trắc nghiệm.\nChiến thuật: Hãy trang bị các kỹ thuật giải nhanh và rèn luyện kỹ năng sử dụng máy tính cầm tay (Casio) thành thạo để ra kết quả tức thì. Hãy tập trung ôn luyện sâu vào các chuyên đề có trọng số điểm lớn như Khảo sát hàm số, Xác suất... Đồng thời, việc rèn luyện chiến thuật phân bổ thời gian hợp lý cho từng câu hỏi là vô cùng quan trọng.`,
        `BaiLearn gợi ý chiến lược Bứt phá cho bạn như sau:\n- Về tư duy, hãy chuyển đổi từ Tự luận -> Trắc nghiệm. Ưu tiên tốc độ.\n- Về kỹ năng, hãy luyện giải nhanh và bấm máy tính thành thạo.\n- Trọng tâm ôn luyện: Dồn lực vào các phần nhiều điểm như Khảo sát hàm số, Xác suất.\n- Ngoài ra, hãy rèn luyện kỹ năng phân bổ thời gian làm bài hợp lý.`,
        `Khi nền tảng đã vững, vấn đề của bạn là tốc độ. Đã đến lúc chuyển từ tư duy giải tự luận sang tư duy trắc nghiệm. Hãy trang bị cho mình các kỹ thuật giải nhanh và rèn luyện kỹ năng sử dụng máy tính cầm tay một cách thành thạo để giải nhanh ra kết quả. Hãy tập trung ôn luyện vào các chuyên đề có trọng số điểm lớn như Khảo sát hàm số, Xác suất,... Đồng thời, bạn cũng nên cố gắng rèn luyện tốt chiến thuật phân bổ thời gian hợp lý nữa nhé!`,
      ],
    },
    {
      min: 201,
      max: 299,
      messages: [
        `Bạn khá ổn ở phần toán học rồi.\nĐể đạt điểm tối đa, bạn cần rèn luyện "tư duy lối tắt". Trước mỗi bài toán, hãy tự hỏi: "Có cách nhìn nào khác để ra đáp án nhanh hơn không?" thay vì lao vào tính toán ngay. Thử thách của bạn nằm ở các câu hỏi vận dụng cao phức tạp. Chiến thuật cho bạn là luyện các phương pháp giải nhanh trắc nghiệm. Hãy rèn luyện áp lực thời gian thật gắt gao: 1 phút/câu. Một sai sót nhỏ trong tính toán ở bước đầu sẽ khiến công sức cả bài đổ sông đổ bể, nên hãy rèn thói quen kiểm tra lại (double-check). Ngoài ra, bạn nên luyện tập thêm một số mẹo sử dụng máy tính cầm tay để tối ưu tốc độ làm bài nhé!`,
        `Để đạt điểm tối đa, bạn cần rèn luyện "tư duy lối tắt". Trước mỗi bài toán, thay vì lao vào tính toán ngay, hãy tự hỏi: "Có cách nhìn nào khác để ra đáp án nhanh hơn không?".\nChiến thuật: Thử thách nằm ở các câu vận dụng cao. Hãy luyện các phương pháp giải nhanh trắc nghiệm dưới áp lực thời gian gắt gao: 1 phút/câu. Một sai sót nhỏ trong tính toán sẽ khiến công sức đổ sông đổ bể, nên bắt buộc phải rèn thói quen kiểm tra lại (double-check). Ngoài ra, hãy luyện thêm các mẹo sử dụng máy tính cầm tay nâng cao để tối ưu hóa tốc độ.`,
        `Bạn khá ổn rồi, giờ muốn điểm tối đa thì phải luyện "tư duy lối tắt". Ở mỗi bài toán, hãy thử hỏi xem có cách nào nhanh hơn không. Chiến thuật là ép thời gian thật gắt: 1 phút 1 câu thôi. Nhớ rèn thói quen kiểm tra lại (double-check) nhé, tính sai một tí là đi tong cả bài đấy. Học thêm mấy mẹo bấm máy tính "đỉnh cao" nữa để tối ưu tốc độ nhé!`,
        `Bước vào 'Chế độ luyện tập cường độ cao', bạn buộc phải cài đặt mindset 'Tư duy lối tắt' – luôn quét nhanh hướng giải tối ưu nhất trước khi đặt bút, thay vì lao đầu vào làm theo quán tính. Hãy tự tạo áp lực thực chiến bằng cách giới hạn tối đa 1 phút cho mỗi câu vận dụng cao, ép não bộ phải phản xạ tức thì. Tuy nhiên, nhanh không được ẩu, kỷ luật Double-check (kiểm tra lại) ngay những bước tính toán đầu tiên là bắt buộc để triệt tiêu sai số. Cuối cùng, hãy biến chiếc Casio thành 'vũ khí hạng nặng' với các thủ thuật nâng cao, giúp bạn tối ưu hóa từng giây trong phòng thi.`,
      ],
    },
    {
      min: 300,
      max: 300,
      messages: [
        `Máy tính chạy bằng cơm hả trời. Tốc độ xử lý của bạn còn nhanh hơn cả người yêu cũ trở mặt! Giải trắc nghiệm Toán mà cứ như đi dạo trong công viên thế này thì ai chơi lại?`,
        `Bạn chính là một chiếc "máy tính chạy bằng cơm" thực thụ! Tốc độ xử lý và độ chính xác của bạn thật đáng kinh ngạc. Giải các bài toán trắc nghiệm hóc búa mà bạn ung dung, nhẹ nhàng như đang dạo chơi vậy. Một trình độ quá đẳng cấp!`,
        `Trời ơi, tốc độ này còn nhanh hơn cả "người yêu cũ trở mặt"! Bạn giải toán mà cứ như đi dạo mát trong công viên thế này thì ai chơi lại? 300 điểm là phần thưởng xứng đáng cho bộ xử lý siêu cấp này.`,
        `Quá khủng khiếp! Với bạn, Toán không là một phần khó, mà là một món tráng miệng. Tốc độ, tư duy, sự chính xác đều ở mức thượng thừa. Đối thủ nhìn thấy bạn chắc chỉ biết lắc đầu ngao ngán!`,
      ],
    },
  ],
  sci: [
    {
      min: 0,
      max: 100,
      messages: [
        `Rất nhiều bạn sợ phần này vì kiến thức quá rộng từ Lý, Hóa đến Sử, Địa. Nhưng nghe BaiLearn này: Đừng lo vì đề thi ĐGNL cung cấp kiến thức ngay trong bài, tất cả định nghĩa và công thức đều có sẵn. Nhiệm vụ của bạn là đọc hiểu văn bản khoa học và nhặt dữ kiện để trả lời. Bí quyết để bứt phá ở mức điểm này là rèn kĩ năng đọc hiểu. Mỗi ngày, bạn nên tìm đọc một đoạn văn về quy trình sản xuất axit hay về một triều đại lịch sử, cố gắng hiểu chúng rồi hỏi đáp với bạn bè. Trong đề thi, chỉ cần bạn chịu khó đọc kỹ, biết cách suy luận từ dữ kiện là bạn đã có thể lấy được 80% số điểm mà không cần kiến thức nền quá sâu. Với các câu Logic, hãy bình tĩnh tóm tắt các quy luật ra nháp, xét từ từ các trường hợp, đừng đoán mò nhé (phần này nhiều điểm á).`,
        `Đừng lo lắng vì kiến thức quá rộng từ Lý, Hóa đến Sử, Địa. Hãy nhớ: Đề thi ĐGNL cung cấp sẵn định nghĩa và công thức ngay trong bài. Nhiệm vụ thực sự của bạn là đọc hiểu văn bản khoa học và nhặt dữ kiện để trả lời.\nChiến lược: Bí quyết bứt phá là rèn kỹ năng đọc hiểu. Mỗi ngày, hãy tìm đọc một đoạn văn (ví dụ: về quy trình sản xuất axit hay một triều đại lịch sử), cố gắng hiểu và hỏi đáp với bạn bè. Trong đề thi, chỉ cần chịu khó đọc kỹ và suy luận từ dữ kiện có sẵn, bạn có thể lấy tới 80% số điểm. Với phần Logic, hãy tóm tắt quy luật ra nháp và xét từ từ các trường hợp, tuyệt đối đừng đoán mò.`,
        `Rất nhiều bạn sợ phần này vì kiến thức quá rộng từ Lý, Hóa đến Sử, Địa. Nhưng nghe BaiLearn này: Đừng lo vì đề thi ĐGNL cung cấp kiến thức ngay trong bài, tất cả định nghĩa và công thức đều có sẵn. Nhiệm vụ của bạn là đọc hiểu văn bản khoa học và nhặt dữ kiện để trả lời. Bí quyết để bứt phá ở mức điểm này là rèn kĩ năng đọc hiểu. Mỗi ngày, bạn nên tìm đọc một đoạn văn về quy trình sản xuất axit hay về một triều đại lịch sử, cố gắng hiểu chúng rồi hỏi đáp với bạn bè. Trong đề thi, chỉ cần bạn chịu khó đọc kỹ, biết cách suy luận từ dữ kiện là bạn đã có thể lấy được 80% số điểm mà không cần kiến thức nền quá sâu. Với các câu Logic, hãy bình tĩnh tóm tắt các quy luật ra nháp, xét từ từ các trường hợp, đừng đoán mò nhé (phần này nhiều điểm á).`,
        `Nhiều bạn sợ phần này vì kiến thức rộng quá, nhưng nghe mình này: Đừng lo! Đề thi cho sẵn kiến thức với công thức hết rồi. Bạn chỉ cần đọc hiểu và nhặt dữ kiện ra thôi. Mỗi ngày bạn chịu khó đọc một đoạn văn về khoa học (như sản xuất axit) hay lịch sử, rồi bàn luận với bạn bè cho quen. Đi thi cứ đọc kỹ, suy luận từ dữ kiện là ẵm trọn 80% điểm ngon ơ. Riêng câu Logic thì nhớ nháp ra, xét từ từ chứ đừng đoán mò nha!`,
      ],
    },
    {
      min: 101,
      max: 200,
      messages: [
        `Bạn đang gặp khó khăn vì sự "lệch tủ" đúng không? Dân tự nhiên thì sợ Sử Địa, dân xã hội thì sợ Lý Hóa. Nhưng nghe BaiLearn này: Đừng lo lắng vì đề thi ĐGNL cung cấp kiến thức ngay trong bài, tất cả định nghĩa và công thức đều có sẵn. Nhiệm vụ của bạn là đọc hiểu văn bản khoa học và nhặt dữ kiện để trả lời. Bí quyết để bứt phá ở mức điểm này là rèn kĩ năng đọc hiểu. Mỗi ngày, bạn nên tìm đọc một đoạn văn về quy trình sản xuất axit hay về một triều đại lịch sử, cố gắng hiểu chúng rồi hỏi đáp với bạn bè. Trong đề thi, chỉ cần bạn chịu khó đọc kỹ, biết cách suy luận từ dữ kiện là bạn đã có thể lấy được 80% số điểm mà không cần kiến thức nền quá sâu. Ngoài ra, phần Logic bạn nên rèn luyện tính cẩn thận hơn trong việc suy luận nhé!`,
        `Bạn đang gặp khó khăn vì sự "lệch tủ"? Dân tự nhiên thì sợ Sử Địa, dân xã hội lại sợ Lý Hóa. Giải pháp: Đừng lo lắng! Tất cả định nghĩa và công thức đều có sẵn trong bài thi. Nhiệm vụ của bạn chỉ là đọc hiểu văn bản và nhặt dữ kiện. Bí quyết là rèn luyện kỹ năng đọc hiểu hàng ngày qua các đoạn văn về quy trình khoa học (như sản xuất axit) hay lịch sử. Trong đề thi, chỉ cần bạn chịu khó đọc kỹ và biết cách suy luận từ dữ kiện cho sẵn là đã nắm chắc 80% số điểm mà không cần kiến thức nền quá sâu. Riêng phần Logic, hãy rèn luyện thêm tính cẩn thận trong việc suy luận nhé.`,
        `Xóa bỏ ngay nỗi ám ảnh mang tên 'Lệch tủ'! Đừng hoảng sợ khi gặp một bài đọc Sử, Địa hay Hóa học xa lạ, vì thực tế đề thi ĐGNL đã cung cấp đủ 100% dữ kiện cần thiết để bạn giải quyết vấn đề. Vũ khí tối thượng lúc này không phải là kiến thức chuyên sâu, mà là kỹ năng Đọc hiểu - Nhặt dữ kiện. Hãy luyện tập hàng ngày bằng cách đọc đa lĩnh vực từ quy trình hóa học đến sự kiện lịch sử và tranh luận cùng bạn bè để mở rộng góc nhìn. Mục tiêu lấy trọn 80% điểm số hoàn toàn nằm trong tầm tay nếu bạn biết cách khai thác dữ liệu đề bài. Và nhớ kỹ: riêng với phần Logic, chỉ một phút lơ là suy luận sẽ khiến công sức đổ sông đổ bể. Hãy cẩn thận khi làm bài nhé!`,
        `Bạn đang sợ "lệch tủ" đúng không? Dân Tự nhiên ngại Sử Địa, còn dân Xã hội thì ngán Lý Hóa. Nhưng yên tâm đi, đề cho sẵn công thức với kiến thức rồi. Việc của bạn là đọc hiểu và lấy dữ kiện ra thôi. Mỗi ngày cứ tìm đọc mấy bài về quy trình axit hay lịch sử các triều đại cho quen. Đi thi chỉ cần chịu khó đọc kỹ là lấy được 80% điểm rồi, không cần kiến thức nền sâu đâu. À, phần Logic thì nhớ rèn tính cẩn thận khi suy luận nhé!`,
      ],
    },
    {
      min: 201,
      max: 299,
      messages: [
        `Bạn có nền tảng kiến thức rộng và tư duy tốt. Thử thách cuối cùng dành cho bạn là tăng tốc độ xử lý các bài toán Logic phức tạp và các câu hỏi suy luận khoa học tổng hợp. Hãy luyện thói quen tóm tắt đề, xét kĩ các trường hợp cho các bài toán Logic để không bị bỏ sót. Với suy luận khoa học, hãy rèn tốc độ đọc - hiểu - suy luận, cố gắng đoán được dụng ý của người ra đề. Hãy nhớ là sự cẩn trọng trong từng suy luận nhỏ sẽ giúp bạn chinh phục mức điểm tuyệt đối.`,
        `Bạn đã có nền tảng kiến thức rộng và tư duy tốt. Thử thách cuối cùng là tăng tốc độ xử lý các bài toán Logic phức tạp và câu hỏi suy luận khoa học tổng hợp. Chiến thuật: Hãy luyện thói quen tóm tắt đề bài và xét thật kỹ các trường hợp trong bài toán Logic để đảm bảo không bỏ sót nghiệm. Với phần suy luận khoa học, hãy rèn tốc độ Đọc - Hiểu - Suy luận, cố gắng "đọc vị" dụng ý của người ra đề. Hãy nhớ rằng, sự cẩn trọng trong từng suy luận nhỏ nhất sẽ là yếu tố quyết định giúp bạn chinh phục mức điểm tuyệt đối.`,
        `Bước vào giai đoạn 'Chinh phục đỉnh cao', tốc độ và sự chính xác là hai yếu tố sống còn. Với các câu hỏi Logic phức tạp, quy tắc bất di bất dịch là: Tóm tắt đề và Xét đủ mọi trường hợp, tuyệt đối không để sót kẽ hở nào. Ở phần Khoa học, hãy rèn luyện combo Đọc - Hiểu - Suy luận ở cường độ cao, thậm chí phải 'đọc vị' được ý đồ người ra đề. Chìa khóa vàng để chạm tay vào điểm tuyệt đối chính là sự cẩn trọng trong từng mắt xích suy luận nhỏ nhất. Đừng để vấp ngã ngay trước cửa thiên đường!`,
        `Kiến thức và tư duy của bạn đều tốt rồi. Giờ là lúc tăng tốc xử lý mấy bài Logic phức tạp và suy luận tổng hợp. Nhớ tập thói quen tóm tắt đề và xét kỹ các trường hợp Logic để không bị sót nhé. Với bài khoa học, hãy rèn tốc độ đọc - hiểu - suy luận và tập đoán xem người ra đề đang muốn "gài" cái gì. Sự cẩn thận trong từng chi tiết nhỏ xíu sẽ giúp bạn chạm tay vào điểm tuyệt đối đấy!`,
      ],
    },
    {
      min: 300,
      max: 300,
      messages: [
        `Bạn là giáo sư biết tuốt. Thám tử lừng danh Conan chắc cũng phải gọi bạn bằng sư phụ! Bạn xâu chuỗi dữ kiện và suy luận quá logic, quá sắc sảo. 300 điểm là phần thưởng xứng đáng cho 'bộ não thiên tài' này!`,
        `Xin gọi bạn là "Giáo sư biết tuốt"! Khả năng xâu chuỗi dữ kiện và tư duy logic của bạn sắc sảo đến mức hoàn hảo. Bạn giải quyết các vấn đề khoa học và logic một cách thuyết phục tuyệt đối. 300 điểm là phần thưởng hoàn toàn xứng đáng cho trí tuệ này.`,
        `Tầm này thì Thám tử lừng danh Conan chắc cũng phải gọi bạn là "Sư phụ"! Bạn nhìn thấu mọi dữ kiện, suy luận logic không chê vào đâu được. Một bộ não thiên tài thực sự, điểm tuyệt đối là điều hiển nhiên!`,
        `Đỉnh cao trí tuệ! Logic sắc bén, kiến thức uyên bác. Bạn xử lý đề thi như một trò chơi trí tuệ mà bạn đã nắm chắc phần thắng. Quá xuất sắc!`,
      ],
    },
  ],
};
