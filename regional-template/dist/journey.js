/* Court-stage navigation and service preparation content. */
window.COURT_JOURNEY = {
  stages: [
    {id:'before',name:'诉前准备',status:'准备起诉，案件尚未受理',title:'还没起诉，对方就开始转移财产？',intro:'先对照紧急情况，再了解是否需要申请保全及提供担保。',photo:'property',caption:'起诉前，先看是否需要保全',note:'诉前保全有紧急性及法定期限要求，应及时向有管辖权的法院确认。',needs:[
      {service:'property-preservation',question:'准备起诉，对方却在转移资产？',story:'例如欠款未付，对方正在出售房产、转走账户资金，担心将来难以执行。',direction:'了解诉前财产保全担保，先确认财产线索、申请金额与法院要求。'},
      {service:'evidence-preservation',question:'关键证据可能很快消失？',story:'例如电子记录可能被删除，现场或易腐物品即将发生变化。',direction:'了解证据保全；是否需要担保及保函形式，由法院结合保全方式确定。'},
      {service:'conduct-preservation',question:'侵害还在持续，无法等到判决？',story:'例如争议行为仍在持续，需要及时申请停止特定行为。',direction:'了解诉前行为保全及相应担保要求，先核实紧急性与拟申请的措施。'}]},
    {id:'filing',name:'立案受理',status:'正在提交起诉材料，或已收到受理通知',title:'已经起诉，想同时申请保全？',intro:'起诉与申请保全是不同事项。根据受理进度，确认申请法院和保函要求。',photo:'evidence',caption:'起诉和保全，分别准备材料',note:'立案本身不等于必须购买保函，也不会自动采取保全措施。',needs:[
      {service:'property-preservation',question:'起诉同时，希望保全对方财产？',story:'希望在案件审理期间保留可供执行的财产，避免“赢了官司却难以执行”。',direction:'了解诉讼财产保全担保，按法院要求核实担保金额、期限及出函主体。'},
      {service:'evidence-preservation',question:'材料已提交，但关键证据难以自行固定？',story:'证据由对方持有，或存在日后难以取得的风险，需要法院采取保全措施。',direction:'先确认保全对象与方式；法院要求提供担保时，再了解证据保全保函。'},
      {service:'conduct-preservation',question:'案件已受理，仍需制止正在发生的行为？',story:'仅提起诉讼还不足以阻止损害继续发生，希望法院作出行为保全裁定。',direction:'了解行为保全担保，围绕具体行为及可能损失准备材料。'}]},
    {id:'trial',name:'一审审理',status:'举证、开庭或等待一审裁判',title:'官司还在审，遇到了新的问题？',intro:'财产风险、持续侵害或紧急给付需求，可分别对应不同的申请方向。',photo:'conduct',caption:'开庭期间，也要留意保全期限',note:'先予执行有法定适用范围与条件，并非所有付款请求都能提前执行。',needs:[
      {service:'property-preservation',question:'审理期间，新发现对方资产或转移风险？',story:'已有财产线索发生变化，需要申请保全、追加申请或核实续保事项。',direction:'了解财产保全担保；已有保函是否需调整，按法院和出函机构要求确认。'},
      {service:'advance-enforcement',question:'医疗费、赡养费等紧急需求，等不到终审？',story:'对符合法定条件的紧急给付请求，希望法院在终审判决前先行裁定执行。',direction:'了解先予执行；法院责令提供担保时，再确认先予执行保函要求。'},
      {service:'conduct-preservation',question:'争议行为持续，造成的影响还在扩大？',story:'审理期间仍需申请责令对方实施或停止特定行为。',direction:'了解行为保全担保，结合申请措施与法院审查要求准备材料。'}]},
    {id:'appeal',name:'上诉与二审',status:'一审裁判已作出，正在上诉或二审中',title:'已经上诉，原来的保函快到期了？',intro:'关注原有保全措施与担保期限，并按新的风险判断是否需要提出申请。',photo:'continued',caption:'二审期间，核对原有保函',note:'二审不是每个案件的必经阶段。普通民事上诉案件应先核实裁判是否生效；上诉本身不产生新的保函需求。',needs:[
      {service:'property-preservation',question:'二审还在进行，原来的保全或保函快到期？',story:'需要核对保全期限与担保期限，避免把原有措施理解为自动无限延续。',direction:'了解续保或担保调整事项，先向法院及原出函机构确认是否需要办理。'},
      {service:'property-preservation',question:'二审期间，出现新的财产风险？',story:'对方财产状况变化，或发现新的可供保全财产。',direction:'了解财产保全担保；是否追加、变更申请及向哪个法院提出，应先行核实。'},
      {service:'release-preservation',question:'财产已被冻结，希望用担保申请解除或变更？',story:'被保全财产影响资金周转，希望了解提供担保的替代方式。',direction:'了解解除保全担保，核实法院是否接受及担保范围。'}]},
    {id:'execution',name:'生效与执行',status:'法律文书已生效，正在申请或推进执行',title:'案件进入执行，法院又要求担保？',intro:'先确认执行进度与争议类型，再判断是否存在特定的担保需求。',photo:'release',caption:'先看执行文书中的担保要求',note:'执行异议或复议并不当然停止执行。普通申请执行也不意味着必须办理保函。',needs:[
      {service:'continued-enforcement',question:'涉及执行异议，法院要求担保后继续推进？',story:'作为申请执行人，希望在特定执行异议、复议等情形下继续相关执行措施。',direction:'了解继续执行担保，先确认执行程序、裁定内容及法院的具体担保要求。'},
      {service:'release-preservation',question:'希望以担保调整已采取的财产措施？',story:'先区分诉讼保全措施与执行查封、冻结，再核实可采用的申请方式。',direction:'了解解除或变更措施的担保需求；执行措施不直接等同于诉讼保全，需单独核实。'}]}
  ],
  services: {
    'property-preservation':{legalTitle:'《民事诉讼法》第一百零三条、第一百零四条',guarantee:'财产保全担保',when:'诉前、立案及审理阶段；上诉期间的保全与续保事项',role:'申请保全的一方',condition:'先确认申请措施与担保要求。诉前财产保全与诉讼中保全的担保规则不同；法院是否接受该保函，以法院审查为准。',materials:['身份或主体资格材料、授权材料','起诉状或案件受理资料（按所处阶段提供）','保全申请、财产线索及申请金额','法院对担保金额、期限和出函主体的要求']},
    'evidence-preservation':{legalTitle:'《民事诉讼法》第八十四条',guarantee:'证据保全担保',when:'诉前紧急情况，或诉讼中证据可能灭失、难以取得时',role:'申请证据保全的一方',condition:'不是所有证据保全都需要保函。措施可能影响证据持有人使用或造成损失时，应按法院要求提供担保。',materials:['申请人资格与案件材料','证据保全申请及证据线索','证据可能灭失或难以取得的情况说明','拟采取的保全方式及法院担保要求']},
    'conduct-preservation':{legalTitle:'《民事诉讼法》第一百零三条、第一百零四条',guarantee:'行为保全担保',when:'诉前或诉讼中需要责令实施、停止特定行为时',role:'申请行为保全的一方',condition:'先明确拟申请的具体行为与紧急性，再按法院要求确认担保形式、金额和期限。',materials:['申请人资格与案件材料','行为保全申请及具体请求','持续侵害、紧急性或损害风险的相关材料','法院担保要求及可能损失的说明']},
    'advance-enforcement':{legalTitle:'《民事诉讼法》第一百零九条、第一百一十条',guarantee:'先予执行担保',when:'终审判决前，符合先予执行条件的紧急给付等情形',role:'申请先予执行的一方',condition:'先予执行须满足法定条件；法院责令提供担保时，再确认是否可以使用保函。',materials:['案件受理资料及主体资格材料','先予执行申请与请求金额','紧急需求及权利义务关系的证明材料','法院对担保形式、金额和期限的要求']},
    'continued-enforcement':{legalTitle:'《关于审理执行异议之诉案件适用法律问题的解释》第六条',legalUrl:'https://www.court.gov.cn/zixun/xiangqing/471731.html',guarantee:'继续执行担保',when:'特定执行异议、复议等程序中的继续执行申请',role:'申请执行人',condition:'不是执行受阻即可用保函恢复执行。须先确认程序类型、相关裁定及法院接受担保的具体条件。',materials:['生效法律文书与执行案件材料','执行异议、复议等相关文书（如有）','继续执行申请及拟执行标的情况','法院对担保范围、金额和期限的要求']},
    'release-preservation':{legalTitle:'《民事诉讼法》第一百零七条',guarantee:'解除保全担保',when:'财产已被保全，希望以担保申请解除或变更措施时',role:'被保全人或依法有权提出申请的主体',condition:'先区分保全措施与执行措施。提供担保不等于自动解封，须由法院审查并作出相应决定。',materials:['主体资格与案件材料','保全裁定、冻结或查封信息','解除或变更申请及担保方案','法院接受的担保形式、金额与期限要求']}
  },
  sources:[
    {title:'民事诉讼法（2023年修正）',url:'https://ipc.court.gov.cn/zh-cn/news/view-6231.html'},
    {title:'民事诉讼证据规定',url:'https://www.court.gov.cn/zixun/xiangqing/212721.html'},
    {title:'执行异议与担保说明',url:'https://www.gzhzcourt.gov.cn/news/50007750.cshtml'}
  ]
};
