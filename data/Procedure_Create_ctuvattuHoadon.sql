DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `Create_CtuvattuHoadon`(IN `fromd` DATE, IN `tod` DATE, IN `ctid` VARCHAR(15))
BEGIN
SELECT kt.ctid,kt.soct, kt.ngay,kt.diengiai,kt.tkno, kt.tkco,kt.sotien as sotienkt,"" as sotienvn, vt.mahang, vt.makho ,th.tenhang,th.donvi,vt.soluong,vt.sotien ,kh.tengoi,kh.diachi,COUNT('hd.ctid') as demHoadon FROM ctuktoan as kt LEFT OUTER JOIN ctuvattu as vt ON  kt.ctid = vt.ctid RIGHT OUTER JOIN tenhang as th ON  vt.mahang = th.mahang RIGHT OUTER JOIN dmtenkho as kh ON  vt.makho = kh.makho RIGHT OUTER JOIN hoadon as hd ON  kt.ctid = hd.ctid where IF(ctid, kt.ngay BETWEEN fromd AND tod AND kt.ctid = ctid ,kt.ngay BETWEEN fromd AND tod ) AND LEFT(kt.tkco,3)="511" GROUP BY kt.ctid,vt.mahang ;
END$$
DELIMITER ;