-- Table: public.root_hashes

-- DROP TABLE public.root_hashes;

CREATE TABLE public.registry
(
    ipfs_hash VARCHAR(46) NOT NULL, --IPFS hash
    identity VARCHAR(64), -- identity - it can be either an ethereum addr or did
    CONSTRAINT registry_pkey PRIMARY KEY (identity)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.root_hashes
  OWNER TO root;
