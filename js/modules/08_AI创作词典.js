// 文件路径: js/modules/08_AI创作词典.js
// 描述: (V40.7 流程优化修复版) 恢复了完整的四步润色流程，并优化了按钮状态管理，确保流程顺畅。

const POLISHING_METHODOLOGY = `
「润色Pro」编辑式
#去AI味道V4.0
润色文本，要着力在以下几个方面精益求精，突破创新:
在语言表达上尽显洗练丰富、灵动优美
在人物塑造上力求栩栩如生、个性鲜明
在情节架构上力求环环相扣、引人入胜
在细节描写上力求传神动人、引发共鸣
在主题立意上力求深刻隽永、发人深省
##基本原则（必须坚决贯彻）
禁止改变原文主题思想、故事走向、结局等核心内容
禁止删减原文中任何场景、人物、对话等关键要素
√务必完整保留原文的写作风格和语言基调
√在不改变原文内容的前提下，力求创新表达方式，丰富语言，增加篇幅
√以简短有力的句子为主，长句不超过20字，注重节奏感
##润色步骤（有条不紊，层层推进)
初步修整:
修正明显语法、标点、别字等低级错误
调整段落划分，将冗长段落适度拆分，改写为行文流畅的短段落
去除对话和叙述中不符合人物身份的方言词，视需要添加个性化语气词
将过长句子拆分成简短句式，增强文章节奏感和力度
创新表达：
替换全文高频出现的同义句式，杜绝同质化表达
在叙述部分适度融入口语化表达，增加语气词、停顿、未完成句等，增强代入感
在不影响内容的前提下，适当添加细节描写,增加文章篇幅
灵活运用对偶、排比等修辞手法，以动作、神态、心理等直接描写代替比喻句
优化人物塑造：
推荐做法:
根据人物身份、性格特点，个性化其言行举止，彰显特色
在对话中适度增加口语化表达、语气词、动作描写，提升人物形象立体感
捕捉人物细微的表情变化、小动作，外化内心活动，避免直白表述
利用服饰、道具细节突出人物特征，增强辨识度
需要规避:
同质化的人物刻画手法，使不同角色“千人一面”
脱离人物身份和情境的言行举-止
平铺直叙、逻辑化的心理活动描写
@关键要义:
立体丰满的人物形象是小说的灵魂所在
言语行为是塑造鲜活人物形象的关键抓手
外在细节刻画要服务于人物性格特点的凸显
适度增加人物间戏份，展现人物关系，推进情节
强化细节描写:
在不影响读者理解的前提下，适度增加细节描写的数量和篇幅
通过细致入微的动作描写，将抽象的情感体验具象化，避免泛泛而谈
多角度捕捉环境特征，将环境融入人物视角，淡化全知视角直接描述
善用细节刻画自然过渡场景，消除地点转换的突兀感
通过生活化细节渲染氛围，引发读者情感共鸣
创新修辞运用:
禁止使用任何形式的比喻句，改用动作、神态等直接描写
用人物反应和细节替代所有比拟和拟人
运用对比、排比等，制造戏剧张力,表达强烈情感
以具体动作和感官描写代替抽象概念
所有情感和心理描写必须转化为可见的外在表现
革新环境描写:
从人物感官切入，以味、香、声、色等描绘环境，活色生香
将环境融入人物心理活动，以情带景，渲染氛围
多视角捕捉环境特征，力求描写新颖别致,跳脱俗套
适时点染环境细节，以小见大，避免堆砌和单一描述
深化情感表达:
以形象具体的外在表现传达抽象情感，杜绝概念化套话
通过人物肢体语言、表情神态来体现内心波动，含蓄蕴藉
利用人物回忆、联想等,增强情感渲染力度，引发共鸣
适度渲染环境氛围，以情景交融烘托情绪,制造张力
精简语言表达:
删除直白累赘的心理活动描写，以具体行动细节替代
删除冗余重复的语句和段落，确保语言简洁凝练
删除模棱可可的“感觉”、“好像”等词，用更准确的表达替代
删除华而不实的陈词滥调，革新表达方式和角度
严谨把控禁用表达:
对标”像一朵凋零的牡丹”等陈词滥调，全文彻底清除此类表达
找出并删除所有“像...一样”“如同...般”“像...”“仿佛...”等套路化比喻句，从人物肢体语言、神态细节等方面予以优化
摒弃“不知所措”、“胸口一堵”等脱离情境的程式化表述，改用更贴近生活、准确传神的描写
对含有“割破人的心”、“瞬间切断”、“压着心口”、“窒息感”等夸张过度词语的句子，删除相关表述，从人物肢体语言、神态细节等方面予以优化
##表达优化指南
###1.陈词滥调的改写原则
×避免使用:
“像...一样”的比喻句
“仿佛...”的虚拟句
过度夸张的表达
脱离情境的程式化词语
/替换方法:
将抽象比喻转化为具体描写
用人物反应替代情景比拟
以动作和细节展现情感
通过他人视角传达感受
###2.具体替换示例
“像一朵凋零的牡丹” → -√“她垂着头，肩膀微微耷拉，曾经挺拔的身姿此刻只剩下疲惫”
“锋利得能割破人的心” → -√“她的话一出口，在场所有人都 不由自主后退一步，呼吸都变得小心翼翼”
“声音像一把刀” → -√“她的话音落下，人群瞬间噤声，只剩下急促的呼吸声”
-×“像只惊弓之鸟” → -√“她缩在角落，不断环顾四周，手指紧紧抓着衣角，稍有动静就浑身一颤”
###3.改写技巧
情感描写:
-用具体反应取代抽象形容
通过场景氛围传达情绪
以群体反应突显个人状态
心理描写:
-将内心活动外化为动作
-用细节反映心理变化
-以他人视角展现心理状态
场景描写:
用具体细节代替概括性描写
-以人物反应渲染氛围
通过动作推进情节
###4.修改重点
-保持原有内容的核心意思
采用更生动具体的表达方式
增强画面感和代入感
避免删减，注重优化替换
##质量标准（精益求精，力臻完美)
确保润色后的文章在形象、语言、节奏等方面较原文有显著提升
-力求在丰富语言、拓展表达方式上有所创新，彰显特色
-确保润色后的文章总字数较原文有所增加，且增加部分均为有效信息
时刻站在读者视角审视文章，着眼提升阅读体验与代入感
—贴合读者口味,创造性地激发阅读兴趣，引发共鸣
##自查清单（严格把关，确保无误）
提交润色稿前须逐一自检:
[ ]是否做到了在不改变原文内容的前提下最大限度地丰富语言
[ ]是否较原文有明显的篇幅增加，且增加的内容均有助于提升阅读体验
[ ]是否彻底杜绝了语言表达雷同、单一的现象，实现表达创新
[ ]修辞运用是否自然得体、巧妙灵动，摆脱了“像...一样”等俗套表达
[ ]是否删除了“感觉”、“似乎”等模糊词语，代之以准确生动的表达
[ ]抽象情感概念是否全部转化为形象生动、可感可视的外在表现
[ ]人物言行举止是否鲜明个性化，有别于其他角色
[ ]对话和叙述部分是否加入了口语表达，更贴近生活
[ ]细节描写是否丰富传神，在推进情节的同时渲染了氛围
[ ]环境描写是否跳脱全知视角，巧妙融入人物视角和心理
[ ]文章整体语言是否凝练简洁，冗余累赘之词均已删除
[ ]是否彻底清除了“像朵凋零的牡丹”、“像把利刃割”一类的陈词滥调和夸张表达
[ ]整体阅读体验是否较原文有大幅提升，更具吸引力、感染力
[ ]是否已替换所有陈词滥调
[ ]替换后的表达是否更加生动具体
[ ]是否保持了原有内容的核心含义
[ ]改写后的内容是否自然流畅
[ ]是否已彻底清除所有比喻句，包括“像”、“仿佛”、“宛如”等
[ ]是否已将所有比喻改写为具体的动作、神态或心理描写
[ ]改写后的描写是否真实自然，没有生硬感
[ ]是否已将过长句子拆分为短句
[ ]句子长度是否以不超过20字为主
[ ]短句是否形成良好的节奏感
唯有做到以上各项，方可交付润色成稿，否则须反复修改，精益求精，追求极致。
##总则（笔耕不辍，孜孜以求）
润色写作是一门需要持续钻研、不断进取的艺术。我们要牢记使命，发扬创新精神，以精雕细琢、别具一匠心的笔法，革故鼎新，力求创造出无愧于时代的优秀作品。
要着力在以下几个方面精益求精，突破创新：
在语言表达上尽显洗练丰富、灵动优美
在人物塑造上力求栩栩如生、个性鲜明
在情节架构上力求环环相扣、引人入胜
在细节描写上力求传神动人、引发共鸣
在主题立意上力求深刻隽永、发人深省
完全破解-朱雀AI检测 & AI润色提示词V3.8
去AI化
缺乏逻辑连贯性和深度：尽管AI能够进行逻辑推理，但在处理复杂话题时,它生成的文本有时会出现逻辑上的跳跃或矛盾。
事实性错误和捏造信息：AI的知识来源于其训练数据，如果数据本身存在偏差或错误，AI就可能会生成不准确甚至完全错误的信息。
缺乏个性和情感，内容空洞和重复: AI生成的文本往往比较平淡，缺乏人类的情感色彩和个性表达。AI倾向于生成信息密度低、缺乏实质内容的文本。它可能会重复使用某些词汇或句式，或者绕圈子说一些无关紧要的话，让人感觉空洞无物，没有抓住重点。
过于完美和流畅，机械的语言模式：AI生成的文本通常语法正确、逻辑清晰，甚至有些过于完美。AI生成的文本有时会呈现出一些特定的语言模式，例如频繁使用某些连接词、套用固定的句式结构等。
如:
部分句式结构可以不完整，表达轻松随意不必太书面化
适当加入口语化吐槽、互联网语言。多使用短句，少用长句
超全“去AI味”内部喂..
内心独白：通过人物内心独白的方式，让读者更理解角色的情感。
对话推动情节：用对话推动情节发展，而不是单纯的叙述。
减少主观评价：避免过多的个人评论，保留客观叙述。
段落间留白：适当在段落间留白，给读者喘息和思考的空间。
引发联想：通过隐喻或类比，引发读者的联想和思考。
提升连贯性：确保段落与段落之间的逻辑连贯，保持流畅性。
简化语言：用更通俗易懂的语言代替复杂的词汇和表达。
减少术语：如果可能，尽量减少使用专业术语，以免读者失去兴趣。
温暖开场：用一个温暖的故事或场景开头，吸引读者情感共鸣。
幽默结尾：以幽默收尾，给读者留下轻松愉快的印象。
适时回忆：通过人物的回忆揭示背景信息，推动情节发展。
描写外貌：具体描写人物的外貌特征，让角色形象更丰满。
气氛烘托：通过环境和气氛的描写烘托情感和情节的发展。
自然过渡：通过自然的过渡句将不同段落连接起来，避免生硬。
对话简化：让对话更加简洁自然，不要太过正式或冗长。
情感递进：随着情节发展，逐步加深角色的情感。
讽刺表达：用讽刺手法表达观点，增加文章的趣味和深度。
文化背景：适当融入文化背景，让读者更好理解文章中的情节。
铺垫和伏笔：通过细小的铺垫和伏笔，为后续的高潮做准备。
情绪对比：通过对比不同情绪，让角色的情感冲突更加明显。
象征意义：为文章中的某些物品或事件赋予象征意义，增加深度。
层层递进：让文章的观点或情节层层递进，逐渐引向高潮。
对话中的情感：在对话中加入情感描写，让角色更有血有肉。
开放式问题：通过开放式的问题引导读者思考，不提供唯一答案。
动作描写：通过动作描写展现角色的心理状态。
减少形容词：减少冗长的形容词，使用更加精准的词语。
设定目标：在文章开头设定明确的目标，吸引读者期待。
多用短句：使用简短有力的句子，增加文章的节奏感。
景物描写：用景物描写衬托角色的心情或文章的主题。
逐步揭示：逐步揭示信息，而不是一次性抛出所有细节。
刻画矛盾：通过刻画角色的内心矛盾，增加文章的张力。
避免重复：避免使用相同的句式或词汇，保持文章的新鲜感。
动作叠加：用动作叠加的方式表现角色的情感或紧张感。
插入对话：在叙述中插入短小对话，增加文章的生动性。
情感转折：通过突然的情感转折，制造惊喜或冲突。
节奏变化：通过改变句子长度和结构，创造文章的节奏感。
细化细节：在关键情节中加入细致的细节描写，增加真实性。
描述触觉：通过触觉的描写，增加感官层次感。
心理活动：刻画角色的内心活动，增加文章的深度。
运用拟人：通过拟人手法让物体或现象更加生动形象。
避免矫情：保持自然真实的情感流露，避免矫揉造作。
简化情节：删除多余的情节，保持故事的紧凑性。
多种语气：根据情节需要使用不同的语气，丰富文章层次。
场景切换：通过场景切换让文章更加多样化和生动。
吸引注意：在文章的开头使用引人入胜的情节或观点。
提升趣味：通过加入趣味性描述或幽默手法，让文章更吸引人。
利用隐喻：通过隐喻的使用，让文章更加有深度和艺术性。
细腻描写：增加情节中的细腻描写，使故事更具可读性。
轻松语气：用轻松的语气写作，让读者有更好的阅读体验。
调整叙述角度：从不同的叙述角度展现同一情节，增加丰富性。
明确时间线：确保文章中时间线清晰，读者易于理解故事发展。
省略手法：通过适当省略，让读者自己填补细节，增加参与感。
回忆式叙述：用回忆的方式来揭示角色的过去和动机。
视角切换：切换不同角色的视角，增加叙述的多样性。
运用夸张：适当夸张某些场景或情感，增强文章的表现力。
减少主观性：减少主观性评判，增加客观事实的叙述。
打破时间顺序：打破线性时间顺序，通过倒叙或插叙丰富情节。
总结反思：在文章结尾加入总结或反思，给读者思考的空间。
渲染气氛：通过环境描写渲染特定的气氛，烘托情感。
对比手法：通过对比手法增强文章的层次感和冲突感。
使用反语：通过反语表达讽刺，增加文章的深度和趣味性。
情感积累：逐渐积累情感，最终达到情感的高潮。
真实对白：对话要符合角色身份和性格，避免刻意的设计感。
避免堆砌：不要为了增加文字量而堆砌词语，保持简洁。
塑造氛围：通过场景描写塑造氛围，让读者有代入感。
细节刻画：刻画小细节让文章更加生动、具体。
悬念留白：在关键情节处设置悬念留白，增加文章的张力。
对比情感：通过对比不同角色的情感，制造冲突和共鸣。
运用象征物：通过象征物暗示文章的主题或情节发展。
平衡情感：保持情感表达的平衡，不要过度渲染某一种情感。
突显反差：通过突显情节或人物的反差，增加阅读的吸引力。
使用平行结构：通过平行结构让文章更加工整、富有节奏感。
清晰开头：确保开头直截了当，让读者迅速进入故事。
言简意赅：删除冗余内容，让每句话都有其必要性。
激发同情心：通过描写角色的痛苦或困难激发读者的同情心。
倒叙展开：用倒叙的方式展开故事，增加文章的悬念感。
融入流行语：适当融入流行语，增加文章的时代感和趣味性。
营造紧张：通过节奏和气氛的塑造，营造紧张的氛围。
展现内心冲突：揭示角色内心的矛盾和冲突，使人物更加立体。
对话的暗示性：通过对话暗示角色的意图或未来的情节发展。
减少副词：减少对动词的修饰，保持语言的简练有力。
多重叙述视角：通过不同角色的叙述展现同一情节，增加复杂性。
灵活使用时间：通过时间的灵活运用增加故事的张力和多样性。
隐喻表达：通过隐喻方式让抽象概念更具象化。
细节铺垫：通过细小的细节铺垫，为后续高潮做准备。
动作推动：让角色的动作推动情节发展，而不是单纯叙述。
感官描写：用更多感官词汇描述情节，增加文章的真实感。
融入幽默感：适当融入munderstand，保持文章的简洁。
塑造多面性格：让角色具备多面性，避免过于单一的性格设定。
揭示真相：通过逐步揭示真相让故事逐渐深入，引人入胜。
表达的节制，不要过度渲染。情感节制: 保持情感
细腻情感描写：通过细腻的情感描写，提升文章的深度。
合理的对话节奏：确保对话之间的节奏自然，不显得刻意。
流畅情节发展：确保情节发展的流畅性，不要让读者觉得跳跃。
避免重复信息：避免重复已经交代的信息，保持叙述的紧凑。
丰富人物背景：通过背景描写，让角色更加立体有血有肉。
利用象征：为场景或情节赋予象征意义，增加文章的深度。
恰当的夸张：适度夸张一些细节，增强文章的感染力。
合理的感情发展：确保角色的感情发展合理，符合情节走向。
逐渐揭示背景：通过逐步揭示背景信息让故事更有层次感。
增强视觉效果：通过细致的视觉描写让文章更加生动。
避免夸张的修饰：避免过多的形容词和副词修饰，保持简洁。
表现人物的成长：通过情节和冲突展现人物的成长和变化。
采用第一人称叙述：用第一人称叙述，增加亲近感和代入感。
短句的冲击力：通过短句创造强烈的情感冲击力。
节奏的调控：根据情节发展调控文章的节奏感。
回忆的交代：用回忆的方式交代背景信息，避免生硬。
使用第二人称：使用第二人称与读者直接对话，增加互动感。
减少堆砌形容词：不要过度堆砌形容词，让语言更加清晰简洁。
自然展开对话：让对话自然展开，不要显得刻意。
情节的意外转折：在关键时刻制造情节的意外转折，增加悬念。
增强角色的矛盾：通过角色的内心矛盾增加故事的张力。
多重情感表达：通过不同情感的表达使文章更加丰富多彩。
环境烘托情感：通过环境的描写烘托人物的情感。
事件的伏笔：通过小细节埋下伏笔，增强文章的连贯性。
避免过度修饰：减少对语言的过度修饰，保持简洁自然。
情感的递进发展：通过情感的逐步递进让故事更加有层次。
直接进入主题：避免过长的铺垫，直接进入故事的核心。
使用排比句：适当使用排比句增加文章的节奏感和感染力。
简短的段落：通过简短的段落让文章更加易读和紧凑。
注意情节的合理性：确保每一个情节的合理性，不要让读者觉得跳跃。
用对话展现人物性格：通过对话来展现人物的性格特点。
避免单一的描述：通过多角度的描写增加文章的层次感。
融入文化背景：通过融入文化背景让文章更加有深度。
避免复杂词汇：尽量使用简单明了的词汇，避免读者困惑。
使用幽默：通过幽默的方式让文章更加轻松有趣。
情感的自然流露：让情感自然流露，避免矫揉造作。
控制信息量：控制每一段的信息量，避免过度堆砌。
逻辑清晰：确保每个段落之间的逻辑清晰，容易理解。
情感的抑扬顿挫：通过情感的起伏让文章更加引人入胜。
情节的层层递进：让情节逐渐递进，增强文章的张力。
使用象征手法：通过象征手法表达更深层次的含义。
避免重复的表达：不要重复表达已经提到的信息，保持内容新鲜。
情节的多重线索：通过多重线索让故事更加复杂多样。
感情的收放自如：让感情的表达收放自如，不要过于生硬。
巧用修辞：在适当的地方使用修辞手法增加文章的美感。
丰富的情感描写：通过丰富的情感描写让文章更加饱满。
适度的情感渲染：通过适度的情感渲染让文章更加感人。
事件的自然推进：让事件自然推进，避免突兀的情节跳转。
简短的情节叙述：通过简短的情节叙述让文章更加紧凑有力。
避免复杂的结构：保持文章结构简洁，避免过于复杂的叙述方式。
自然的情感转折：让情感的转折自然，不要让读者觉得突兀。
控制情节的发展：通过控制情节的发展节奏让文章更加紧凑。
注重细节描写：通过细致的细节描写让文章更加生动。

`;

// 【优化】增加状态变量，用于追踪步骤完成情况
let lastPolishSuggestions = "";
let preliminaryPolishedProse = ""; 
let refinementCompleted = false;
let tomatoFormatCompleted = false;


function renderDictionaryPanel() {
    const proseTextarea = document.getElementById('polished-prose-output');
    if(proseTextarea) {
        proseTextarea.addEventListener('input', updateDictionaryPanelState);
    }

    document.getElementById('start-preliminary-polish-btn').addEventListener('click', handlePreliminaryPolish);
    document.getElementById('get-polish-suggestions-btn').addEventListener('click', getPolishSuggestions);
    document.getElementById('start-full-refinement-btn').addEventListener('click', handleFullRefinement);
    document.getElementById('start-tomato-format-btn').addEventListener('click', handleFormatForTomato);

    const exportButtons = document.getElementById('final-export-buttons');
    if(exportButtons){
        exportButtons.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (button && button.dataset.format) {
                handleFinalConsolidatedExport(button.dataset.format);
            }
        });
    }


    document.querySelectorAll('.workspace-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const targetId = e.currentTarget.dataset.target;
            document.querySelectorAll('.workspace-tab').forEach(t => t.classList.remove('active'));
            e.currentTarget.classList.add('active');
            document.querySelectorAll('.workspace-content').forEach(c => c.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
        });
    });
}

/**
 * 【核心修正】重写按钮状态管理函数，恢复并优化了工作流逻辑
 */
function updateDictionaryPanelState() {
    const proseOutput = document.getElementById('polished-prose-output');
    const hasContent = proseOutput.value.trim() !== '';

    const preliminaryPolishBtn = document.getElementById('start-preliminary-polish-btn');
    const getSuggestionsBtn = document.getElementById('get-polish-suggestions-btn');
    const fullRefinementBtn = document.getElementById('start-full-refinement-btn');
    const tomatoFormatBtn = document.getElementById('start-tomato-format-btn');

    // 步骤1和2：只要有文本就可以启动
    if (preliminaryPolishBtn) preliminaryPolishBtn.disabled = !hasContent;
    if (getSuggestionsBtn) getSuggestionsBtn.disabled = !hasContent;

    // 步骤3：只有在获取建议成功后（lastPolishSuggestions有内容）才能启动
    const canRefine = hasContent && lastPolishSuggestions.trim() !== '';
    if (fullRefinementBtn) fullRefinementBtn.disabled = !canRefine;

    // 步骤4：只有在全文精修完成后才能启动
    const canTomato = hasContent && refinementCompleted;
    if (tomatoFormatBtn) tomatoFormatBtn.disabled = !canTomato;
    
    // 导出按钮：只要有内容就可以导出
    document.querySelectorAll('#final-export-buttons button').forEach(btn => {
        btn.disabled = !hasContent;
    });

    if (creationState.finalProse && !proseOutput.value.trim()) {
         proseOutput.value = creationState.finalProse.replace(/---.*?---/g, '').trim();
         setTimeout(updateDictionaryPanelState, 0);
    }

    if (!hasContent){
        proseOutput.placeholder = '请先在“圣典执笔者”模块完成写作，或直接在此处粘贴您的外部文稿...';
    }
    
    const suggestionsView = document.getElementById('suggestions-view');
    if (lastPolishSuggestions) {
        let html = lastPolishSuggestions.replace(/###\s*(.*)/g, '<h4>$1</h4>').replace(/\n/g, '<br>');
        suggestionsView.innerHTML = html;
    } else {
        suggestionsView.innerHTML = '<p>请先执行“获取整体建议”来生成报告。</p>';
    }
}


async function handlePreliminaryPolish() {
    const polishBtn = document.getElementById('start-preliminary-polish-btn');
    const outputTextarea = document.getElementById('polished-prose-output');
    const fullText = outputTextarea.value;

    if (!fullText) {
        showNotification("没有可排版的内容。", "error");
        return;
    }

    polishBtn.disabled = true;
    polishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在排版...';
    showNotification("AI正在进行初步排版，为手机阅读优化...", "info");

    const prompt = `你是一位专业的网文排版编辑。请严格按照以下【排版铁律】，对提供的【原始稿件】进行重新排版，使其更适合手机端阅读。
### 排版铁律:
1.  **段落拆分**: 将所有长度超过三行（约60-80字）的冗长段落，拆分成更短小的、行数在1-3行之间的小段落。
2.  **对话格式**: 确保每个角色的对话都独立成段，前面不留空两格。
3.  **长句处理**: 将超过25个字的复杂长句，改写为几个逻辑连贯的短句，增强节奏感。
4.  **内容保持**: 绝对禁止修改、增删原文的任何文字内容、情节和语序，你的唯一任务就是调整格式。
5.  **错误修正**: 修正文中明显的错别字和标点符号错误。
### 原始稿件:
---
${fullText}
---
### 你的任务:
请只返回经过你精心排版后的【完整全文】。`;

    try {
        const formattedText = await callApi(prompt, false);
        await streamTextToTextarea(outputTextarea, formattedText, 1, true);
        preliminaryPolishedProse = formattedText; // 缓存排版后的文本
        showNotification("初步排版完成！", "success");
    } catch (error) {
        showNotification(`排版失败: ${error.message}`, "error");
    } finally {
        polishBtn.innerHTML = '<i class="fas fa-mobile-alt"></i> 启动初步排版';
        updateDictionaryPanelState(); // 恢复所有按钮状态
    }
}

async function getPolishSuggestions() {
    const suggestBtn = document.getElementById('get-polish-suggestions-btn');
    const rawProse = document.getElementById('polished-prose-output').value;
    if (!rawProse.trim()) {
        showNotification("没有找到可供分析的稿件。", "error");
        return;
    }
    
    const outputDiv = document.getElementById('suggestions-view');
    outputDiv.innerHTML = "<p>AI资深责编正在通读您的稿件并生成深度分析报告...</p>";
    document.querySelector('.workspace-tab[data-target="suggestions-view"]').click();
    
    showNotification("正在获取责编润色建议...", "info");
    suggestBtn.disabled = true;
    suggestBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在分析...';
    
    // 【优化】重置后续步骤的状态，以便重新开始流程
    refinementCompleted = false;
    tomatoFormatCompleted = false;
    lastPolishSuggestions = "";

    const prompt = `
# 身份：资深网络小说主编
# 任务：对以下【小说稿件】进行全面审核，并生成一份结构化的修改建议报告。
# 审核依据:
1.  【故事大纲】: ${sanitizeForTemplate(creationState.finalOutline || '用户未提供')}
2.  【叙事融合策略】: ${sanitizeForTemplate(creationState.weavingPlan || '用户未提供')}
# 小说稿件:
---
${rawProse}
---
# 输出要求:
请直接输出一份Markdown格式的报告，必须包含以下部分：
### 一、总体评价与核心建议
(宏观评价稿件优缺点，并提出1-2条最重要的修改方向。)
### 二、逻辑与大纲一致性检查
(仔细比对【稿件】和【故事大纲】，找出具体的情节偏差或节奏问题，并提出修改方案。)
### 三、重点段落情绪渲染分析
(找出1-2个关键情感段落，分析其情绪渲染是否到位，并提供增强感染力的具体方法。)`;

    try {
        const suggestions = await callApi(prompt, false);
        lastPolishSuggestions = suggestions; // 关键：获取到建议后，更新状态变量
        showNotification("资深责编建议已生成！现在可以进行第三步了。", "success");
    } catch (error) {
        lastPolishSuggestions = ""; // 失败时清空
        outputDiv.innerHTML = `<p style="color:var(--error-color);">获取建议失败: ${error.message}</p>`;
        showNotification("获取建议失败。", "error");
    } finally {
        suggestBtn.innerHTML = '<i class="fas fa-user-edit"></i> 获取编辑建议';
        updateDictionaryPanelState(); // 【关键】操作结束后，调用状态更新函数
    }
}

async function handleFullRefinement() {
    const refineBtn = document.getElementById('start-full-refinement-btn');
    const outputTextarea = document.getElementById('polished-prose-output');
    const textToRefine = outputTextarea.value;
    
    if (!textToRefine) {
        showNotification("没有可精修的内容。", "error");
        return;
    }

    refineBtn.disabled = true;
    refineBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在精修...';
    showNotification("AI正在对全文进行深度精修，请稍候...", "info");
    document.querySelector('.workspace-tab[data-target="prose-view"]').click();

    // 【优化】重置后续步骤的状态
    tomatoFormatCompleted = false;

    const prompt = `你是一位顶级的网文大神级编辑。请严格遵循“润色Pro方法论”，并重点参考下面的“资深责编报告”，对“原始稿件”进行一次深入的、完整的全文润色精修。
### 润色Pro方法论 (你的行动纲领):
${POLISHING_METHODOLOGY}
### 资深责编报告 (最高优先级参考):
${lastPolishSuggestions || "无"}
### 原始稿件:
---
${textToRefine}
---
### 你的任务:
请只返回经过你精心润色后的【完整全文】。不要添加任何额外的解释或评论。`;

    try {
        const polishedFullText = await callApi(prompt, false);
        await streamTextToTextarea(outputTextarea, polishedFullText, 1, true);
        creationState.finalProse = polishedFullText; // 同步更新state
        refinementCompleted = true; // 关键：精修完成后，更新状态变量
        showNotification("全文精修已完成！现在可以进行第四步了。", "success");
    } catch (error) {
        refinementCompleted = false; // 失败时重置
        showNotification(`全文精修失败: ${error.message}`, "error");
    } finally {
        refineBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> 启动全文精修';
        updateDictionaryPanelState(); // 【关键】操作结束后，调用状态更新函数
    }
}

async function handleFormatForTomato() {
    const formatBtn = document.getElementById('start-tomato-format-btn');
    const outputTextarea = document.getElementById('polished-prose-output');
    const prose = outputTextarea.value;
    if (!prose) {
        showNotification("没有可供格式化的内容。", "error");
        return;
    }

    showNotification("AI正在为您的作品提取标签并生成番茄格式...", "info");
    
    formatBtn.disabled = true;
    formatBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在生成...';
    document.querySelector('.workspace-tab[data-target="prose-view"]').click();

    const prompt = `你是一位经验丰富的番茄小说编辑。请阅读以下完整小说，并为其提取最合适的标签和生成一个吸引人的标题与简介。
### 小说全文:
${prose}
### 你的任务:
1.  **分析小说**: 深入理解故事的核心元素、风格、主角性格、情节类型。
2.  **提取标签**: 从故事中提取5-8个精准关键词作为标签。
3.  **生成标题**: 根据内容生成一个爆款标题。
4.  **生成简介**: 根据内容生成一段100-150字的吸引人简介。
5.  **格式化输出**: 严格按照下面的JSON格式返回结果，不要添加任何额外解释。
    {"title": "生成的标题", "tags": ["标签1", "标签2", ...], "brief": "生成的简介"}
`;

    try {
        const response = await callApi(prompt, true);
        const result = parseAiJson(response);
        const tags = result.tags || [];
        const title = result.title || creationState.inspirationConcept?.title || '未命名作品';
        const brief = result.brief || creationState.inspirationConcept?.brief || '暂无简介';
        
        let formattedText = `作品标题：${title}\n\n`;
        formattedText += `作品标签：${tags.join(' | ')}\n\n`;
        formattedText += `简介：\n${brief}\n\n`;
        formattedText += `--- 正文 ---\n\n`;
        formattedText += prose.replace(/---.*?---/g, '').trim();

        await streamTextToTextarea(outputTextarea, formattedText, 1, true);
        creationState.finalProse = formattedText;
        tomatoFormatCompleted = true; // 关键：完成后更新状态
        showNotification("番茄格式化完成！现在可以导出了。", "success");
    } catch (error) {
        tomatoFormatCompleted = false; // 失败时重置
        showNotification(`番茄格式化失败: ${error.message}`, "error");
        outputTextarea.value = prose;
    } finally {
        formatBtn.innerHTML = '<i class="fas fa-tags"></i> 启动番茄化';
        updateDictionaryPanelState(); // 【关键】操作结束后，调用状态更新函数
    }
}

function handleFinalConsolidatedExport(format) {
    const finalFormattedProse = document.getElementById('polished-prose-output').value;
    if (!finalFormattedProse) {
        showNotification("没有可导出的最终稿件。", "error");
        return;
    }

    let title = '未命名作品';
    const titleMatch = finalFormattedProse.match(/作品标题：(.*?)\n/);
    if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim();
    } else if (creationState.inspirationConcept?.title) {
        title = creationState.inspirationConcept.title;
    }

    const weavingPlanText = sanitizeForTemplate(creationState.weavingPlan || '（未生成）');
    const outlineText = sanitizeForTemplate(creationState.finalOutline || '（未生成或导入）');

    let consolidatedContent = `作品名称：${title}\n`;
    consolidatedContent += "========================================\n";
    consolidatedContent += " 叙事融合策略\n";
    consolidatedContent += "========================================\n\n";
    consolidatedContent += weavingPlanText + "\n\n";
    consolidatedContent += "========================================\n";
    consolidatedContent += " 故事大纲\n";
    consolidatedContent += "========================================\n\n";
    consolidatedContent += outlineText + "\n\n";
    consolidatedContent += "========================================\n";
    consolidatedContent += " 最终稿件\n";
    consolidatedContent += "========================================\n\n";
    consolidatedContent += finalFormattedProse;

    const filename = `${title} - 完整项目文档`;
    downloadFile(consolidatedContent, filename, format);
    showNotification(`已开始导出整合稿 ${format.toUpperCase()} 文件。`, "success");
}