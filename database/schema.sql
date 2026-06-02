-- ============================================================
-- VibeCoding 数据库 Schema (MySQL 8.0+)
-- 生成时间: 2026-05-27
-- ============================================================

CREATE DATABASE IF NOT EXISTS vibecoding
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE vibecoding;

-- ============================================================
-- 用户表
-- ============================================================
CREATE TABLE ts_users (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  nickname      VARCHAR(50)   NOT NULL UNIQUE        COMMENT '用户昵称',
  email         VARCHAR(255)  NOT NULL UNIQUE        COMMENT '邮箱',
  phone         VARCHAR(20)   DEFAULT NULL           COMMENT '手机号',
  avatar        VARCHAR(500)  DEFAULT NULL           COMMENT '头像 URL',
  introduction  VARCHAR(200)  DEFAULT NULL           COMMENT '简介',
  password_hash VARCHAR(255)  DEFAULT NULL           COMMENT '密码 hash (可选，支持微信登录)',
  github_url    VARCHAR(500)  DEFAULT NULL           COMMENT 'GitHub 主页',
  rednote_url   VARCHAR(500)  DEFAULT NULL           COMMENT '小红书主页',
  bilibili_url  VARCHAR(500)  DEFAULT NULL           COMMENT 'Bilibili 主页',
  juejin_url    VARCHAR(500)  DEFAULT NULL           COMMENT '掘金主页',
  weibo_url     VARCHAR(500)  DEFAULT NULL           COMMENT '微博主页',
  portal_url    VARCHAR(500)  DEFAULT NULL           COMMENT '个人网站',
  status        TINYINT       NOT NULL DEFAULT 1     COMMENT '1=正常 2=禁用',
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_users_email (email),
  INDEX idx_users_status (status)
) ENGINE=InnoDB COMMENT='系统-用户表';


-- ============================================================
-- 用户统计表 (1:1 users)
-- 分离高频更新的统计数据，减少主表锁竞争
-- ============================================================
CREATE TABLE ts_user_stats (
  user_id       BIGINT PRIMARY KEY,
  works         INT UNSIGNED NOT NULL DEFAULT 0      COMMENT '作品数',
  collections   INT UNSIGNED NOT NULL DEFAULT 0      COMMENT '收藏数',
  likes         INT UNSIGNED NOT NULL DEFAULT 0      COMMENT '获赞数',
  following     INT UNSIGNED NOT NULL DEFAULT 0      COMMENT '关注数',
  followers     INT UNSIGNED NOT NULL DEFAULT 0      COMMENT '粉丝数',
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='系统-用户统计表';


-- ============================================================
-- 用户关注表 (M:N users)
-- ============================================================
CREATE TABLE tr_user_follows (
  id            BIGINT       NOT NULL AUTO_INCREMENT,
  follower_id   BIGINT       NOT NULL                  COMMENT '关注者用户 ID',
  followed_id   BIGINT       NOT NULL                  COMMENT '被关注者用户 ID',
  status        TINYINT      NOT NULL DEFAULT 1        COMMENT '0=已取消 1=关注中',
  create_time   BIGINT       NOT NULL DEFAULT 0        COMMENT '关注时间（13位时间戳）',
  update_time   BIGINT       NOT NULL DEFAULT 0        COMMENT '更新时间（13位时间戳）',
  is_deleted    TINYINT      NOT NULL DEFAULT 0        COMMENT '是否删除：0->否; 1->是;',
  version       INT          NOT NULL DEFAULT 0        COMMENT '版本号',

  PRIMARY KEY (id),
  UNIQUE KEY uk_follow (follower_id, followed_id),
  INDEX idx_follows_followed (followed_id)
) ENGINE=InnoDB COMMENT='关系-用户关注表';


-- ============================================================
-- 作品表
-- ============================================================
CREATE TABLE tb_vibecoding (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  author_id     BIGINT        NOT NULL                COMMENT '作者用户 ID',
  title         VARCHAR(100)  NOT NULL                COMMENT '作品名称',
  subtitle      VARCHAR(200)  DEFAULT NULL            COMMENT '作品副标题',
  category_id   BIGINT        NOT NULL                COMMENT '分类 ID',
  platform      VARCHAR(20)   NOT NULL                COMMENT '运行平台: web/ios/android/desktop/mini-program/cross',
  model         VARCHAR(50)   DEFAULT NULL            COMMENT '使用的 AI 模型',
  duration      VARCHAR(30)   DEFAULT NULL            COMMENT '开发周期',
  license       VARCHAR(50)   DEFAULT NULL            COMMENT '许可证',
  instructions  TEXT          DEFAULT NULL            COMMENT '项目说明书 (Markdown)',
  cover_url     VARCHAR(500)  NOT NULL DEFAULT ''     COMMENT '封面图 URL',
  screenshots   TEXT          DEFAULT NULL            COMMENT '项目截图（逗号分隔 URL）',
  demo_url      VARCHAR(500)  DEFAULT NULL            COMMENT '在线演示地址',
  repo_url      VARCHAR(500)  DEFAULT NULL            COMMENT '源码仓库地址',
  is_online     TINYINT(1)    NOT NULL DEFAULT 0      COMMENT '是否上线',
  online_date   DATE          DEFAULT NULL            COMMENT '上线日期',
  featured      TINYINT(1)    NOT NULL DEFAULT 0      COMMENT '是否精选',
  status        TINYINT       NOT NULL DEFAULT 1      COMMENT '1=草稿2=待审核3=审核中4=通过5=驳回6=待调整7=已发布8=下架9=删除10=封禁',
  likes         INT UNSIGNED  NOT NULL DEFAULT 0      COMMENT '获赞数',
  views         INT UNSIGNED  NOT NULL DEFAULT 0      COMMENT '浏览数',
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted    TINYINT       NOT NULL DEFAULT 0        COMMENT '是否删除：0->否; 1->是;',
  version       INT           NOT NULL DEFAULT 0        COMMENT '版本号',

  INDEX idx_vibecoding_author (author_id),
  INDEX idx_vibecoding_category (category_id),
  INDEX idx_vibecoding_status (status),
  INDEX idx_vibecoding_platform (platform),
  INDEX idx_vibecoding_featured (featured, status),
  INDEX idx_vibecoding_created (created_at DESC),
  INDEX idx_vibecoding_likes (likes DESC),
  INDEX idx_vibecoding_views (views DESC),
) ENGINE=InnoDB COMMENT='业务-作品表';


-- ============================================================
-- 前台字典类型表（参考后台 td_dict_type 结构，独立维护）
-- ============================================================
CREATE TABLE td_biz_dict_type (
  id            BIGINT       NOT NULL AUTO_INCREMENT  COMMENT '字典主键',
  dict_name     VARCHAR(100) NOT NULL DEFAULT ''       COMMENT '字典名称',
  dict_type     VARCHAR(100) NOT NULL DEFAULT ''       COMMENT '字典类型',
  status        TINYINT      NOT NULL DEFAULT 0        COMMENT '状态（0正常 1停用）',
  remark        VARCHAR(500) DEFAULT NULL              COMMENT '备注',
  create_by     BIGINT       UNSIGNED DEFAULT NULL     COMMENT '创建人',
  create_time   BIGINT       NOT NULL DEFAULT 0        COMMENT '创建时间（13位时间戳）',
  update_by     BIGINT       UNSIGNED DEFAULT NULL     COMMENT '更新人',
  update_time   BIGINT       NOT NULL DEFAULT 0        COMMENT '更新时间（13位时间戳）',
  is_deleted    TINYINT      NOT NULL DEFAULT 0        COMMENT '是否删除：0->否; 1->是;',
  version       INT          NOT NULL DEFAULT 0        COMMENT '版本号',

  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uniq_dict_type` (`dict_type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='字典-前台字典类型表';


-- ============================================================
-- 前台字典数据表（参考后台 td_biz_dict_data 结构，独立维护）
-- ============================================================
CREATE TABLE td_biz_dict_data (
  id            BIGINT       NOT NULL AUTO_INCREMENT  COMMENT '主键',
  dict_type     VARCHAR(100) NOT NULL                  COMMENT '字典类型',
  dict_label    VARCHAR(100) NOT NULL                  COMMENT '字典编码',
  dict_value    VARCHAR(100) NOT NULL                  COMMENT '字典值',
  sort          INT          DEFAULT 0                 COMMENT '排序号',
  status        TINYINT      NOT NULL DEFAULT 1        COMMENT '启用状态',
  css_class     VARCHAR(100) DEFAULT NULL              COMMENT '样式属性（其他样式扩展）',
  list_class    VARCHAR(100) DEFAULT NULL              COMMENT '表格回显样式',
  is_default    CHAR(1)      DEFAULT 'N'               COMMENT '是否默认（Y是 N否）',
  remark        VARCHAR(500) DEFAULT NULL              COMMENT '备注',
  create_by     BIGINT       UNSIGNED DEFAULT NULL     COMMENT '创建人',
  create_time   BIGINT       NOT NULL DEFAULT 0        COMMENT '创建时间（13位时间戳）',
  update_by     BIGINT       UNSIGNED DEFAULT NULL     COMMENT '更新人',
  update_time   BIGINT       NOT NULL DEFAULT 0        COMMENT '更新时间（13位时间戳）',
  is_deleted    TINYINT      NOT NULL DEFAULT 0        COMMENT '是否删除：0->否; 1->是;',
  version       INT          NOT NULL DEFAULT 0        COMMENT '版本号',

  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uniq_type_code` (`dict_type`, `dict_label`) USING BTREE,
  INDEX `idx_dict_type` (`dict_type`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='字典-前台字典数据表';
-- 作品标签表 (M:N vibecoding ↔ tag strings)
-- 标签为自由文本，不单独建字典表
-- ============================================================
CREATE TABLE tr_work_tags (
  id            BIGINT       NOT NULL AUTO_INCREMENT,
  vibecoding_id BIGINT       NOT NULL                  COMMENT '作品 ID',
  code          VARCHAR(100) NOT NULL                  COMMENT 'dict_value',
  name          VARCHAR(100) NOT NULL                  COMMENT 'dict_label',
  create_time   BIGINT       NOT NULL DEFAULT 0        COMMENT '创建时间（13位时间戳）',
  update_time   BIGINT       NOT NULL DEFAULT 0        COMMENT '更新时间（13位时间戳）',
  is_deleted    TINYINT      NOT NULL DEFAULT 0        COMMENT '是否删除：0->否; 1->是;',
  version       INT          NOT NULL DEFAULT 0        COMMENT '版本号',

  PRIMARY KEY (id),
  UNIQUE KEY uk_work_tag (vibecoding_id, code)
) ENGINE=InnoDB COMMENT='关系-作品标签';


-- ============================================================
-- 作品截图表 (1:N vibecoding)
-- ============================================================
-- 截图已合并至 tb_vibecoding.screenshots 字段（逗号分隔 URL）


-- ============================================================
-- 作品-开发语言关联表 (M:N vibecoding ↔ td_biz_dict_data)
-- ============================================================
CREATE TABLE tr_work_languages (
  id            BIGINT       NOT NULL AUTO_INCREMENT,
  vibecoding_id BIGINT       NOT NULL,
  code          VARCHAR(100) NOT NULL                  COMMENT '开发语言编码',
  name          VARCHAR(100) NOT NULL                  COMMENT '开发语言名称',
  create_time   BIGINT       NOT NULL DEFAULT 0       COMMENT '创建时间（13位时间戳）',
  update_time   BIGINT       NOT NULL DEFAULT 0       COMMENT '更新时间（13位时间戳）',
  is_deleted    TINYINT      NOT NULL DEFAULT 0       COMMENT '是否删除：0->否; 1->是;',
  version       INT          NOT NULL DEFAULT 0       COMMENT '版本号',

  PRIMARY KEY (id),
  UNIQUE KEY uk_work_lang (vibecoding_id, code)
) ENGINE=InnoDB COMMENT='关系-作品开发语言';


-- ============================================================
-- 作品-Agent工具关联表 (M:N vibecoding ↔ td_biz_dict_data)
-- ============================================================
CREATE TABLE tr_work_tools (
  id            BIGINT       NOT NULL AUTO_INCREMENT,
  vibecoding_id BIGINT       NOT NULL,
  code          VARCHAR(100) NOT NULL                  COMMENT 'Agent 工具编码',
  name          VARCHAR(100) NOT NULL                  COMMENT 'Agent 工具名称',
  create_time   BIGINT       NOT NULL DEFAULT 0       COMMENT '创建时间（13位时间戳）',
  update_time   BIGINT       NOT NULL DEFAULT 0       COMMENT '更新时间（13位时间戳）',
  is_deleted    TINYINT      NOT NULL DEFAULT 0       COMMENT '是否删除：0->否; 1->是;',
  version       INT          NOT NULL DEFAULT 0       COMMENT '版本号',

  PRIMARY KEY (id),
  UNIQUE KEY uk_work_tool (vibecoding_id, code)
) ENGINE=InnoDB COMMENT='关系-作品Agent工具';


-- ============================================================
-- 作品-Skills关联表 (M:N vibecoding ↔ td_biz_dict_data)
-- code = dict_value(显示名称), name = dict_label(编码)
-- ============================================================
CREATE TABLE tr_work_skills (
  id            BIGINT       NOT NULL AUTO_INCREMENT,
  vibecoding_id BIGINT       NOT NULL,
  code          VARCHAR(100) NOT NULL                  COMMENT 'dict_value',
  name          VARCHAR(100) NOT NULL                  COMMENT 'dict_label',
  create_time   BIGINT       NOT NULL DEFAULT 0       COMMENT '创建时间（13位时间戳）',
  update_time   BIGINT       NOT NULL DEFAULT 0       COMMENT '更新时间（13位时间戳）',
  is_deleted    TINYINT      NOT NULL DEFAULT 0       COMMENT '是否删除：0->否; 1->是;',
  version       INT          NOT NULL DEFAULT 0       COMMENT '版本号',

  PRIMARY KEY (id),
  UNIQUE KEY uk_work_skill (vibecoding_id, code)

) ENGINE=InnoDB COMMENT='关系-作品Skills';


-- ============================================================
-- 作品-MCP服务关联表 (M:N vibecoding ↔ td_biz_dict_data)
-- code = dict_value(显示名称), name = dict_label(编码)
-- ============================================================
CREATE TABLE tr_work_mcps (
  id            BIGINT       NOT NULL AUTO_INCREMENT,
  vibecoding_id BIGINT       NOT NULL,
  code          VARCHAR(100) NOT NULL                  COMMENT 'dict_value',
  name          VARCHAR(100) NOT NULL                  COMMENT 'dict_label',
  create_time   BIGINT       NOT NULL DEFAULT 0       COMMENT '创建时间（13位时间戳）',
  update_time   BIGINT       NOT NULL DEFAULT 0       COMMENT '更新时间（13位时间戳）',
  is_deleted    TINYINT      NOT NULL DEFAULT 0       COMMENT '是否删除：0->否; 1->是;',
  version       INT          NOT NULL DEFAULT 0       COMMENT '版本号',

  PRIMARY KEY (id),
  UNIQUE KEY uk_work_mcp (vibecoding_id, code)

) ENGINE=InnoDB COMMENT='关系-作品MCP服务';


-- ============================================================
-- 用户收藏作品表 (M:N users ↔ vibecoding)
-- ============================================================
CREATE TABLE tr_user_interactions (
  id            BIGINT       NOT NULL AUTO_INCREMENT,
  user_id       BIGINT       NOT NULL                  COMMENT '用户 ID',
  vibecoding_id BIGINT       NOT NULL                  COMMENT '作品 ID',
  type          TINYINT      NOT NULL                  COMMENT '1=点赞 2=收藏',
  status        TINYINT      NOT NULL DEFAULT 0        COMMENT '状态：0=正常 1=删除',
  create_by     BIGINT       UNSIGNED DEFAULT NULL     COMMENT '创建人',
  update_by     BIGINT       UNSIGNED DEFAULT NULL     COMMENT '更新人',
  create_time   BIGINT       NOT NULL DEFAULT 0        COMMENT '创建时间（13位时间戳）',
  update_time   BIGINT       NOT NULL DEFAULT 0        COMMENT '更新时间（13位时间戳）',
  is_deleted    TINYINT      NOT NULL DEFAULT 0        COMMENT '是否删除：0->否; 1->是;',

  PRIMARY KEY (id),
  INDEX idx_interactions_user (user_id, vibecoding_id, type),
  INDEX idx_interactions_work (vibecoding_id)
) ENGINE=InnoDB COMMENT='关系-用户互动（点赞/收藏）';


-- ============================================================
-- 初始数据
-- ============================================================

-- 字典类型
INSERT INTO td_biz_dict_type (dict_name, dict_type) VALUES
  ('作品分类',       'work_category'),
  ('开发语言',       'programming_language'),
  ('Agent 工具',     'agent_tool'),
  ('Skills',         'skill'),
  ('MCP 服务',       'mcp_service'),
  ('运行平台',       'runtime_platform'),
  ('许可证',         'license'),
  ('开发周期',       'duration');

-- 作品分类
INSERT INTO td_biz_dict_data (dict_type, dict_label, dict_value, sort) VALUES
  ('work_category', 'web',    'Web 应用', 1),
  ('work_category', 'mobile', '移动端',   2),
  ('work_category', 'ai',     'AI 创作',  3),
  ('work_category', 'game',   '游戏',     4),
  ('work_category', 'tool',   '开发工具', 5),
  ('work_category', 'art',    '视觉艺术', 6);

-- 开发语言
INSERT INTO td_biz_dict_data (dict_type, dict_label, dict_value, sort) VALUES
  ('programming_language', 'typescript',  'TypeScript',     1),
  ('programming_language', 'javascript',  'JavaScript',     2),
  ('programming_language', 'vue3',        'Vue 3',          3),
  ('programming_language', 'react',       'React',          4),
  ('programming_language', 'python',      'Python',         5),
  ('programming_language', 'go',          'Go',             6),
  ('programming_language', 'rust',        'Rust',           7),
  ('programming_language', 'java',        'Java',           8),
  ('programming_language', 'kotlin',      'Kotlin',         9),
  ('programming_language', 'swift',       'Swift',         10),
  ('programming_language', 'css',         'CSS',           11),
  ('programming_language', 'scss',        'SCSS',          12),
  ('programming_language', 'unocss',      'UnoCSS',        13),
  ('programming_language', 'tailwind',    'Tailwind CSS',  14);

-- Agent 工具
INSERT INTO td_biz_dict_data (dict_type, dict_label, dict_value, sort) VALUES
  ('agent_tool', 'claude-code',        'Claude Code',        1),
  ('agent_tool', 'cursor',             'Cursor',             2),
  ('agent_tool', 'windsurf',           'Windsurf',           3),
  ('agent_tool', 'github-copilot',     'GitHub Copilot',     4),
  ('agent_tool', 'cline',              'Cline',              5),
  ('agent_tool', 'aider',              'Aider',              6),
  ('agent_tool', 'continue',           'Continue',           7),
  ('agent_tool', 'amazon-q',           'Amazon Q',           8),
  ('agent_tool', 'codeium',            'Codeium',            9),
  ('agent_tool', 'tabnine',            'Tabnine',           10),
  ('agent_tool', 'replit-ghostwriter', 'Replit Ghostwriter',11),
  ('agent_tool', 'v0',                 'V0',                12),
  ('agent_tool', 'bolt',               'Bolt',              13),
  ('agent_tool', 'lovable',            'Lovable',           14),
  ('agent_tool', 'replit-agent',       'Replit Agent',      15);

-- Skills
INSERT INTO td_biz_dict_data (dict_type, dict_label, dict_value, sort) VALUES
  ('skill', 'frontend-design',     '前端设计',       1),
  ('skill', 'backend-api',         '后端 API',       2),
  ('skill', 'database-design',     '数据库设计',     3),
  ('skill', 'devops',              'DevOps 部署',    4),
  ('skill', 'testing',             '自动化测试',     5),
  ('skill', 'code-review',         '代码审查',       6),
  ('skill', 'documentation',       '文档生成',       7),
  ('skill', 'refactoring',         '代码重构',       8),
  ('skill', 'performance',         '性能优化',       9),
  ('skill', 'security-audit',      '安全审计',      10),
  ('skill', 'ui-component',        'UI 组件开发',   11),
  ('skill', 'state-management',    '状态管理',      12),
  ('skill', 'i18n',                '国际化',        13),
  ('skill', 'accessibility',       '无障碍',        14),
  ('skill', 'data-visualization',  '数据可视化',    15);

-- MCP 服务
INSERT INTO td_biz_dict_data (dict_type, dict_label, dict_value, sort) VALUES
  ('mcp_service', 'filesystem',   'Filesystem',     1),
  ('mcp_service', 'github',       'GitHub',         2),
  ('mcp_service', 'postgres',     'PostgreSQL',     3),
  ('mcp_service', 'slack',        'Slack',          4),
  ('mcp_service', 'notion',       'Notion',         5),
  ('mcp_service', 'figma',        'Figma',          6),
  ('mcp_service', 'supabase',     'Supabase',       7),
  ('mcp_service', 'vercel',       'Vercel',         8),
  ('mcp_service', 'cloudflare',   'Cloudflare',     9),
  ('mcp_service', 'docker',       'Docker',        10),
  ('mcp_service', 'redis',        'Redis',         11),
  ('mcp_service', 'playwright',   'Playwright',    12),
  ('mcp_service', 'puppeteer',    'Puppeteer',     13),
  ('mcp_service', 'brave-search', 'Brave Search',  14),
  ('mcp_service', 'tavily',       'Tavily',        15);

-- 运行平台
INSERT INTO td_biz_dict_data (dict_type, dict_label, dict_value, sort) VALUES
  ('runtime_platform', 'web',          'Web',      1),
  ('runtime_platform', 'ios',          'iOS',      2),
  ('runtime_platform', 'android',      'Android',  3),
  ('runtime_platform', 'desktop',      '桌面端',   4),
  ('runtime_platform', 'mini-program', '小程序',   5),
  ('runtime_platform', 'cross',        '跨平台',   6);

-- 许可证
INSERT INTO td_biz_dict_data (dict_type, dict_label, dict_value, sort) VALUES
  ('license', 'mit',         'MIT',          1),
  ('license', 'apache-2.0',  'Apache 2.0',   2),
  ('license', 'gpl-3.0',     'GPL 3.0',      3),
  ('license', 'bsd-3-clause','BSD 3-Clause', 4),
  ('license', 'agpl-3.0',    'AGPL 3.0',     5),
  ('license', 'mpl-2.0',     'MPL 2.0',      6),
  ('license', 'unlicense',   'Unlicense',    7);

-- 开发周期
INSERT INTO td_biz_dict_data (dict_type, dict_label, dict_value, sort) VALUES
  ('duration', '1-week',  '1 周',   1),
  ('duration', '2-weeks', '2 周',   2),
  ('duration', '1-month', '1 个月', 3),
  ('duration', '3-months','3 个月', 4),
  ('duration', '6-months','6 个月', 5),
  ('duration', '1-year',  '1 年',   6);

SET FOREIGN_KEY_CHECKS = 1;
