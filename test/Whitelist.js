const { expect } = require("chai");

describe("Whitelist Contract", function () {
  let Whitelist;
  let whitelist;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    Whitelist = await ethers.getContractFactory("Whitelist");
    [owner, addr1, addr2] = await ethers.getSigners();
    whitelist = await Whitelist.deploy();
    await whitelist.waitForDeployment();
  });

  it("Should add a single address to the whitelist", async function () {
    await whitelist.connect(owner).addSingleToWhitelist(addr1.address);
    expect(await whitelist.whitelist(addr1.address)).to.equal(true);
  });

  it("Should add multiple addresses to the whitelist", async function () {
    await whitelist.connect(owner).addToWhitelist([addr1.address, addr2.address]);
    expect(await whitelist.whitelist(addr1.address)).to.equal(true);
    expect(await whitelist.whitelist(addr2.address)).to.equal(true);
  });

  it("Should remove an address from the whitelist", async function () {
    await whitelist.connect(owner).addSingleToWhitelist(addr1.address);
    await whitelist.connect(owner).removeFromWhitelist(addr1.address);
    expect(await whitelist.whitelist(addr1.address)).to.equal(false);
  });

  it("Should check if an address is whitelisted", async function () {
    await whitelist.connect(owner).addSingleToWhitelist(addr1.address);
    expect(await whitelist.isWhitelisted(addr1.address)).to.equal(true);
    expect(await whitelist.isWhitelisted(addr2.address)).to.equal(false);
  });

  it("Should emit AddedBeneficiary event when adding a single address", async function () {
    await expect(whitelist.connect(owner).addSingleToWhitelist(addr1.address))
      .to.emit(whitelist, "AddedBeneficiary")
      .withArgs(addr1.address);
  });

  it("Should emit AddedBeneficiary event when adding multiple addresses", async function () {
    await expect(whitelist.connect(owner).addToWhitelist([addr1.address, addr2.address]))
      .to.emit(whitelist, "AddedBeneficiary")
      .withArgs(addr1.address)
      .to.emit(whitelist, "AddedBeneficiary")
      .withArgs(addr2.address);
  });
});
