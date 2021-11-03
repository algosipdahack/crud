CREATE TABLE users (
    `id`             INT          NOT NULL,
    `loginId`       VARCHAR(20)   NOT NULL,
    `pw`            VARCHAR(100)  NOT NULL,
    `name`          VARCHAR(20)   NOT NULL,
    `age`            INT UNSIGNED  NULL,
    `married`         TINYINT     NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE comments (
    `id`             INT          NOT NULL,
    `parentId`       INT          NULL,
    `commenter`      INT          NOT NULL,
    `comment`        VARCHAR(100)      NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (commenter) REFERENCES users (id) ON UPDATE RESTRICT ON DELETE RESTRICT
);