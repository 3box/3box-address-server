-- Table: public.registry

-- DROP TABLE public.registry;

CREATE TABLE public.registry
(
    ipfs_hash VARCHAR(46) NOT NULL, --IPFS hash
    identity VARCHAR(64), -- identity - it can be either an ethereum addr or did
    CONSTRAINT registry_pkey PRIMARY KEY (ipfs_hash,identity)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.registry
  OWNER TO root;
