-- Table: public.links

-- DROP TABLE public.links;

CREATE TABLE public.links
(
    address VARCHAR(46) NOT NULL, -- ethereum address
    did VARCHAR(100) NOT NULL, -- did,
    consent text,
    type VARCHAR(64), -- account type(ethereum-eoa, erc1271)
    chainId VARCHAR(30),
    contractAddress VARCHAR(46),
    timestamp INT NOT NULL DEFAULT 0,
    CONSTRAINT links_pkey PRIMARY KEY (address)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.links
  OWNER TO threebox;
